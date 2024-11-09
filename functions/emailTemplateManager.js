// templateManager.js
const handlebars = require('handlebars')
const fs = require('fs')
const path = require('path')
const { timeOfDay } = require('./utils')
const juice = require('juice')

handlebars.registerHelper('timeOfDay', timeOfDay)
/**
 * Class for managing and rendering email templates using Handlebars.
 * @class EmailTemplateManager
 * @description Handles loading email templates from filesystem
 *  and rendering them with provided data.
 */
class EmailTemplateManager {
  /**
   * Creates an instance of EmailTemplateManager.
   * @memberof EmailTemplateManager
   */
  constructor() {
    this.templates = new Map()
    this.cssPath = path.join(__dirname, 'templates/email/styles/components.css')
    this.templateDir = path.join(__dirname, 'templates/email')
    this.componentsDir = path.join(__dirname, 'templates/email/components')
    this.loadCss()
    this.loadTemplates()
    this.registerPartials()
  }

  /**
   * Register all partials from the components directory.
   * @memberof EmailTemplateManager
   * @throws {Error} If the partials cannot be registered.
   */
  registerPartials() {
    try {
      // Read all files in components directory
      const componentFiles = fs.readdirSync(this.componentsDir)

      componentFiles.forEach((file) => {
        if (file.endsWith('.hbs')) {
          const partialName = 'components/' + path.basename(file, '.hbs')
          const partialContent = fs.readFileSync(path.join(this.componentsDir, file), 'utf8')
          handlebars.registerPartial(partialName, partialContent)
        }
      })
    } catch (error) {
      console.error('Failed to register partials:', error)
    }
  }

  /**
   * Load the CSS file from the filesystem.
   * @memberof EmailTemplateManager
   * @throws {Error} If the CSS file cannot be loaded.
   * @return {void}
   */
  loadCss() {
    try {
      this.css = fs.readFileSync(this.cssPath, 'utf8')
    } catch (error) {
      console.error(`Failed to load CSS file from ${this.cssPath}:`, error)
      this.css = '' // Fallback to empty CSS
    }
  }

  /**
   * Load all email templates from the filesystem.
   * @memberof EmailTemplateManager
   */
  loadTemplates() {
    const templateFiles = fs.readdirSync(this.templateDir)
    templateFiles.forEach((file) => {
      const templateName = path.basename(file, '.hbs')
      // Make sure we're only reading files, not directories
      const filePath = path.join(this.templateDir, file)
      if (fs.statSync(filePath).isFile()) {
        const templateContent = fs.readFileSync(filePath, 'utf8')
        // Process your template file content here
        this.templates.set(templateName, handlebars.compile(templateContent))
      }
    })
  }

  /**
   * Render an email template with provided data.
   * @param {string} templateName - The name of the template to render.
   * @param {object} data - The data to render the template with.
   * @return {string} The rendered email template.
   * @memberof EmailTemplateManager
   * @throws {Error} If the template with the provided name is not found.
   */
  render(templateName, data) {
    const template = this.templates.get(templateName)
    if (!template) {
      throw new Error(`Template ${templateName} not found`)
    }
    const html = template(data)
    return juice.inlineContent(html, this.css)
  }
}

module.exports = new EmailTemplateManager()
