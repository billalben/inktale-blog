import MarkdownIt from "markdown-it";
import hljs from "highlight.js";

export const markdown = new MarkdownIt({
  breaks: true,
  linkify: true,
  highlight(str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(str, { language: lang, ignoreIllegals: true })
          .value;
      } catch (error) {
        console.error(
          "Error in highlighting code",
          error instanceof Error ? error.message : error,
        );
        throw error;
      }
    }
    return "";
  },
});
