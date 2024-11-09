// templateManager.js
const handlebars = require('handlebars')
const fs = require('fs')
const path = require('path')

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
    this.templateDir = path.join(__dirname, 'templates/email')
    this.loadTemplates()
  }

  /**
   * Load all email templates from the filesystem.
   * @memberof EmailTemplateManager
   */
  loadTemplates() {
    const templateFiles = fs.readdirSync(this.templateDir)
    templateFiles.forEach((file) => {
      const templateName = path.basename(file, '.hbs')
      const templateContent = fs.readFileSync(path.join(this.templateDir, file), 'utf-8')
      this.templates.set(templateName, handlebars.compile(templateContent))
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
    return template(data)
  }
}

module.exports = new EmailTemplateManager()
