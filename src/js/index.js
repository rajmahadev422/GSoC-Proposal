// ===== THEME MANAGER =====
class ThemeManager {
  constructor() {
    this.themeToggle = document.getElementById("themeToggle");
    this.html = document.documentElement;
    this.init();
  }

  init() {
    const savedTheme = localStorage.getItem("theme") || "dark";
    this.applyTheme(savedTheme);

    if (this.themeToggle) {
      this.themeToggle.onclick = () => this.toggleTheme();
    }
  }

  toggleTheme() {
    const current = this.html.getAttribute("data-theme");
    this.applyTheme(current === "dark" ? "light" : "dark");
  }

  applyTheme(theme) {
    this.html.setAttribute("data-theme", theme);
    if (this.themeToggle) {
      this.themeToggle.textContent = theme === "dark" ? "🌙" : "☀️";
    }
    localStorage.setItem("theme", theme);
  }
}

// ===== SIDEBAR MANAGER =====
class SidebarManager {
  constructor() {
    this.menuBtn = document.getElementById("menuBtn");
    this.sidebar = document.getElementById("sidebar");
    this.init();
  }

  init() {
    if (this.menuBtn) {
      this.menuBtn.onclick = () => this.toggle();
    }

    // Close when clicking outside
    document.addEventListener("click", (e) => this.handleOutsideClick(e));
  }

  toggle() {
    if (this.sidebar) {
      this.sidebar.classList.toggle("show");
    }
  }

  handleOutsideClick(e) {
    if (window.innerWidth <= 768 && this.sidebar && this.menuBtn) {
      const isClickInsideSidebar = this.sidebar.contains(e.target);
      const isMenuButton = this.menuBtn.contains(e.target);

      if (!isClickInsideSidebar && !isMenuButton) {
        this.sidebar.classList.remove("show");
      }
    }
  }

  async render() {
    if (!this.sidebar) return;

    this.sidebar.innerHTML = "";

    // Search wrap
    const searchWrap = document.createElement("div");
    searchWrap.className = "search-wrap";
    const searchInput = document.createElement("input");
    searchInput.placeholder = "Search docs...";
    searchInput.className = "search-box";
    searchWrap.appendChild(searchInput);
    this.sidebar.appendChild(searchWrap);

    // Nav container
    const nav = document.createElement("div");
    nav.className = "sidebar-nav";
    this.sidebar.appendChild(nav);

    const currentHash = window.location.hash.replace(/^#\/?/, "");

    try {
      const res = await fetch("docs/table_of_content.json");
      const data = await res.json();

      const renderList = (filter = "") => {
        nav.innerHTML = "";

        Object.entries(data).forEach(([section, files]) => {
          const sectionDiv = document.createElement("div");
          sectionDiv.className = "sidebar-section";

          const title = document.createElement("div");
          title.className = "sidebar-title";

          const text = document.createElement("span");
          text.textContent = section;

          const arrow = document.createElement("i");
          arrow.className = "arrow";
          arrow.textContent = "→";

          title.appendChild(text);
          title.appendChild(arrow);

          const list = document.createElement("div");
          list.className = "sidebar-list";

          let hasMatch = false;

          files.forEach((file) => {
            if (
              file.name &&
              !file.name.toLowerCase().includes(filter.toLowerCase())
            )
              return;

            hasMatch = true;

            const link = document.createElement("a");
            link.href = `#/${file.url}`;
            link.textContent = file.name;
            link.className = "sidebar-link";

            if (file.path === currentHash) {
              link.classList.add("active");
            }

            list.appendChild(link);
          });

          if (!hasMatch) return;

          list.style.maxHeight = list.scrollHeight + "px";

          title.onclick = () => {
            const isOpen = list.style.maxHeight !== "0px";
            list.style.maxHeight = isOpen ? "0px" : list.scrollHeight + "px";
            arrow.textContent = isOpen ? "→" : "↓";
          };

          sectionDiv.appendChild(title);
          sectionDiv.appendChild(list);
          nav.appendChild(sectionDiv);
        });
      };

      searchInput.addEventListener("input", (e) => {
        renderList(e.target.value);
      });

      renderList();
    } catch (error) {
      console.error("Error rendering sidebar:", error);
    }
  }
}

// ===== MARKDOWN PARSER =====
class MarkdownParser {
  constructor() {
    this.headersList = [];
  }

  tokenize(md) {
    const regex = /:::(\w+)([^\n]*)\n([\s\S]*?):::/g;
    let tokens = [];
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(md)) !== null) {
      if (match.index > lastIndex) {
        tokens.push({
          type: "markdown",
          content: md.slice(lastIndex, match.index),
        });
      }

      tokens.push({
        type: "block",
        blockType: match[1],
        attrs: match[2].trim(),
        content: match[3],
      });

      lastIndex = regex.lastIndex;
    }

    if (lastIndex < md.length) {
      tokens.push({
        type: "markdown",
        content: md.slice(lastIndex),
      });
    }

    return tokens;
  }

  parseAttributes(str) {
    const attrs = {};
    const regex = /(\w+)=(\w+)/g;
    let match;

    while ((match = regex.exec(str))) {
      attrs[match[1]] = match[2];
    }

    return attrs;
  }

  parse(tokens) {
    return tokens.map((token) => {
      if (token.type === "markdown") {
        return {
          type: "markdown",
          content: token.content,
        };
      }

      if (token.type === "block") {
        const attrs = this.parseAttributes(token.attrs);

        if (token.blockType === "code") {
          return this.parseCodeBlock(token.content, attrs);
        }

        return {
          type: "unknown",
          content: token.content,
        };
      }
    });
  }

  parseCodeBlock(content) {
    const regex = /```(\w+)\s*\n([\s\S]*?)```/g;
    let blocks = [];
    let match;

    while ((match = regex.exec(content))) {
      blocks.push({
        lang: match[1],
        code: match[2].trim(),
      });
    }

    return {
      type: "codeTabs",
      blocks,
    };
  }

  mapLang(lang) {
    const map = {
      py: "python",
      js: "javascript",
      cpp: "cpp",
      java: "java",
      sh: "bash",
    };
    return map[lang] || lang;
  }

  async loadIncludes(md) {
    const regex = /:::include\{(.+?)\}/g;
    const matches = [...md.matchAll(regex)];

    for (const match of matches) {
      const full = match[1].trim();
      let [filePath, linePart] = full.split("#");

      try {
        const res = await fetch(`${filePath}`);
        let code = await res.text();

        if (linePart) {
          code = this.extractLines(code, linePart);
        }

        const ext = filePath.split(".").pop();
        const lang = this.mapLang(ext);

        const replacement = `\`\`\`${lang}\n${code}\n\`\`\``;
        md = md.replace(match[0], replacement);
      } catch {
        md = md.replace(match[0], `Error loading ${filePath}`);
      }
    }

    return md;
  }

  extractLines(code, linePart) {
    const lines = code.split("\n");
    linePart = linePart.replace(/\s+/g, "").toUpperCase();

    const rangeMatch = linePart.match(/^L(\d+)-L(\d+)$/);
    if (rangeMatch) {
      const start = parseInt(rangeMatch[1], 10);
      const end = parseInt(rangeMatch[2], 10);
      return lines.slice(start - 1, end).join("\n");
    }

    const singleMatch = linePart.match(/^L(\d+)$/);
    if (singleMatch) {
      const lineNum = parseInt(singleMatch[1], 10);
      return lines[lineNum - 1] || "";
    }

    return code;
  }
}

// ===== CODE RENDERER =====
class CodeRenderer {
  constructor(parser) {
    this.parser = parser;
  }

  createCodeTabs(blocks) {
    const container = document.createElement("div");
    container.className = "code-container";

    const tabs = document.createElement("div");
    tabs.className = "tabs";

    const pre = document.createElement("pre");
    const code = document.createElement("code");

    let active = 0;

    const update = () => {
      const lang = this.parser.mapLang(blocks[active].lang);
      code.className = `language-${lang}`;
      code.textContent = blocks[active].code;
      Prism.highlightElement(code);

      [...tabs.children].forEach((btn, i) => {
        btn.classList.toggle("active", i === active);
      });
    };

    blocks.forEach((b, i) => {
      const btn = document.createElement("button");
      btn.textContent = b.lang;
      btn.onclick = () => {
        active = i;
        update();
      };
      tabs.appendChild(btn);
    });

    const copyBtn = document.createElement("button");
    copyBtn.textContent = "Copy";
    copyBtn.id = "copy-btn";
    copyBtn.onclick = () => {
      navigator.clipboard.writeText(blocks[active].code);
    };

    container.appendChild(copyBtn);
    pre.appendChild(code);
    container.appendChild(tabs);
    container.appendChild(pre);

    update();
    return container;
  }
}

// ===== TABLE OF CONTENTS MANAGER =====
class TableOfContentsManager {
  constructor() {
    this.tocContainer = document.getElementById("toc");
    this.btn = null;
    this.menu = null;
    this.ul = null;
    this.init();
  }

  init() {
    if (!this.tocContainer) return;

    // Create button
    this.btn = document.createElement("button");
    this.btn.id = "toc-btn";
    this.btn.className = "toc-btn";
    this.btn.innerHTML = `<span></span><span></span><span></span>`;

    // Create menu
    this.menu = document.createElement("div");
    this.menu.className = "toc-menu";

    this.ul = document.createElement("ul");

    this.menu.appendChild(this.ul);
    this.tocContainer.appendChild(this.btn);
    this.tocContainer.appendChild(this.menu);

    // Default expand
    this.btn.classList.add("active");
    this.menu.classList.add("show");
    this.autoCloseToc(5000);

    // Toggle
    this.btn.addEventListener("click", () => this.toggle());

    document.addEventListener("click", (e) => {
      requestAnimationFrame(() => {
        const isClickInside =
          this.btn.contains(e.target) || this.menu.contains(e.target);
        if (!isClickInside) {
          this.close();
        }
      });
    });
  }

  toggle() {
    this.btn.classList.toggle("active");
    this.menu.classList.toggle("show");
  }

  close() {
    this.btn.classList.remove("active");
    this.menu.classList.remove("show");
  }

  autoCloseToc(time = 3000) {
    setTimeout(() => this.close(), time);
  }

  update(headers) {
    if (!this.ul) return;

    this.ul.innerHTML = "";

    const li1 = document.createElement("li");
    li1.textContent = "Table of Contents";
    li1.classList.add("li1");
    this.ul.appendChild(li1);

    headers.forEach((h, idx) => {
      const text = h.innerText.trim();
      if (text !== "") {
        const uniqueId = "heading-anchor-" + idx;
        h.id = uniqueId;

        const li = document.createElement("li");
        li.textContent = text;
        li.classList.add("li2");

        li.onclick = () => {
          const targetElement = document.getElementById(uniqueId);
          if (targetElement) {
            targetElement.scrollIntoView({ behavior: "smooth" });
          }
        };

        this.ul.appendChild(li);
      }
    });
  }
}

// ===== DOCUMENTATION VIEWER =====
class DocumentationViewer {
  constructor() {
    this.overlay = document.getElementById("overlay");
    this.app = document.getElementById("app");
    this.breadcrumb = document.getElementById("breadcrumb");
    this.parser = new MarkdownParser();
    this.codeRenderer = new CodeRenderer(this.parser);
    this.sidebarManager = new SidebarManager();
    this.tocManager = new TableOfContentsManager();

    this.init();
  }

  init() {
    window.addEventListener("hashchange", () => this.load());
    window.addEventListener("DOMContentLoaded", () => this.load());

    // Setup TOC observer
    this.setupTOCObserver();
  }

  setupTOCObserver() {
    const observer = new MutationObserver(() => {
      const headers = this.app.querySelectorAll("h1, h2");
      this.tocManager.update(headers);
    });

    observer.observe(this.app, { childList: true, subtree: true });
  }

  async load() {
    this.showOverlay();

    const page = this.getCurrentPage();
    if (!page) {
      await this.loadHomePage();
      this.hideOverlay();
      return;
    }

    await this.sidebarManager.render();

    let md = await this.loadMarkdown(page);
    md = await this.parser.loadIncludes(md);
    const tokens = this.parser.tokenize(md);
    const ast = this.parser.parse(tokens);

    this.render(ast);
    this.updateBreadcrumb(page);
    this.wrapTables();

    this.hideOverlay();
  }

  async loadHomePage() {
    const layout = document.getElementById("layout");
    if (layout) {
      const res = await fetch(`src/Home.html`);
      const home = await res.text();
      layout.innerHTML = home;
    }
  }

  showOverlay() {
    if (this.overlay) {
      this.overlay.classList.add("show");
    }
  }

  hideOverlay() {
    if (this.overlay) {
      this.overlay.classList.remove("show");
    }
  }

  getCurrentPage() {
    const hash = window.location.hash;
    if (!hash || hash === "#") return "intro/quick-start.md";
    return hash.replace(/^#\/?/, "");
  }

  async loadMarkdown(path) {
    try {
      const res = await fetch(`docs/${path}`);
      if (!res.ok) {
        const errorRes = await fetch("src/404.html");
        return await errorRes.text();
      }
      return await res.text();
    } catch (err) {
      return `<p>${err.message}</p>`;
    }
  }

  updateBreadcrumb(page) {
    if (!this.breadcrumb) return;

    const parts = page.replace(/\.md$/, "").split("/");
    this.breadcrumb.innerHTML = parts
      .map((p, i) => {
        const label = p.charAt(0).toUpperCase() + p.slice(1).replace(/-/g, " ");
        return i < parts.length - 1
          ? `<span>${label}</span><span class="sep">›</span>`
          : `<span style="color:var(--text)">${label}</span>`;
      })
      .join("");
  }

  render(ast) {
    if (!this.app) return;

    this.app.innerHTML = "";

    ast.forEach((node) => {
      if (node.type === "markdown") {
        const div = document.createElement("div");
        div.innerHTML = marked.parse(node.content);
        this.app.appendChild(div);
      } else if (node.type === "codeTabs") {
        this.app.appendChild(this.codeRenderer.createCodeTabs(node.blocks));
      }
    });
  }

  wrapTables() {
    if (!this.app) return;

    this.app.querySelectorAll("table").forEach((table) => {
      const wrapper = document.createElement("div");
      wrapper.className = "table-wrapper";
      table.parentNode.insertBefore(wrapper, table);
      wrapper.appendChild(table);
    });
  }
}

// ===== INITIALIZATION =====
document.addEventListener("DOMContentLoaded", () => {
  new ThemeManager();
  new DocumentationViewer();
});
