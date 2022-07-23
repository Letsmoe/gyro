{
	css: "../style/docs.css",
	outDir: "../out/",
	rootDir: "./",
	watch: true,
	wrapper: function(head, header, body, footer, metadata, md) {
		return `<!DOCTYPE html><html><head>${head}${this.generateMetadata(metadata)}</head><body>${header}<div class="content">${body}</div>${footer}</body></html>`
	}
}