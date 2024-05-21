const { Client } = require("@notionhq/client")

export class NotionClient {

    constructor(options) {
        this.databaseId = options?.databaseId || "none";
        this.pageId = options?.pageId || "none";
        this.client = new Client({
            auth: options?.authToken || "none"
        })
    }

    formatCitation = (selection) => {
        // TODO add formal citation formatting
        return {
            paragraph: {
                rich_text: [{
                    type: "text",
                    text: {
                        content: selection.sourceUrl,
                        link: {url: selection.sourceUrl}
                    }
                }]
            }
        }
    }

    formatQuote = (selection) => {
        // TODO: transform html to markdown, and then markdown to blocks
        //via @tryfabric/martian
        return {
            type: "quote",
            quote: {
                rich_text: [{
                    type: "text",
                    text: {
                        content: selection.selectedText
                    }
                }]
            }
        }
    }


  createPageProperties = (selection) => {
    return {
        parent: {
            // TODO: add database support
            // database_id: this.databaseId,
            page_id: this.pageId,
        },
       children: [this.formatQuote(selection),
                   this.formatCitation(selection)],
        icon: {type: "external",
               external: {
                   url: selection.sourceFavicon
               }},

        properties: {
            // this is not explicit in notion api docs, but it works
            title: {
                title: [{
                    text: {
                        content: selection.sourcePageTitle,
                    },
                }],
            }
        }
    }
  }

  addDatabaseToPage = () => {
    return this.client.databases.create({ parentId: this.pageId })
  }

  addNotionPageToDatabase = (selection) => {
      let properties = this.createPageProperties(selection);
      return this.client.pages.create(properties);
  }
}
