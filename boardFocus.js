try {
	var body = document.body;

	if (body.classList.contains("azure-board-focus--normal")) {
		body.classList.remove("azure-board-focus--normal");
		body.classList.add("azure-board-focus--focused");
		showFocusedView();
	} else if (body.classList.contains("azure-board-focus--focused")) {
		body.classList.remove("azure-board-focus--focused");
		body.classList.add("azure-board-focus--revamped");
		showRevampedView();
	} else if (body.classList.contains("azure-board-focus--revamped")) {
		body.classList.remove("azure-board-focus--revamped");
		body.classList.add("azure-board-focus--normal");
		showNormalView();
	} else {
		expandBoardColumns();

		// Create views
		var initialBoard = document.getElementsByClassName("flex-row flex-grow v-scroll-auto")[0];
		var focusedBoard = initialBoard.cloneNode(true);
		var revampedBoard = initialBoard.cloneNode(true);

		// Create "Normal" view
		var normal = document.createElement("div");
		normal.className = "azure-board-focus-content--normal";
		Array.from(body.children).forEach((child) => {
			normal.appendChild(child);
		});

		// Create "Focused" view
		var focused = document.createElement("div");
		focused.className = "azure-board-focus-content--focused";
		focused.appendChild(focusedBoard);

		// Create "Revamped" view
		var revamped = document.createElement("div");
		revamped.className = "azure-board-focus-content--revamped";
		revamped.style.flexDirection = "column";
		var revampedKanban = revampedBoard.getElementsByClassName("kanban-board")[0];
		var revampedKanbanHeader = revampedBoard.getElementsByClassName("kanban-board-column-header-container")[0];
		var revampedKanbanContent = revampedBoard.getElementsByClassName("kanban-board-content")[0];
		revampedKanban.style.maxWidth = "100%";
		revampedKanban.style.minWidth = "100%";
		revampedKanban.style.overflowX = "auto";
		revampedKanbanHeader.style.minWidth = (parseInt(revampedKanbanContent.children[1].style.minWidth.replace(/px/,""))*1.5)+"px";
		revampedKanbanContent.children[1].style.minWidth = (parseInt(revampedKanbanContent.children[1].style.minWidth.replace(/px/,""))*1.5)+"px";
		var closedColumn = revampedKanbanContent.lastElementChild.cloneNode(true);
		closedColumn.firstElementChild.style.flexDirection = "row";
		closedColumn.firstElementChild.style.overflowX = "scroll";
		Array.from(closedColumn.firstElementChild.children).forEach((item) => {
			item.style.minWidth = "300px";
		});
		revampedBoard.style.minHeight = "max-content";
		revampedBoard.style.overflowY = "visible";
		revamped.style.overflowY = "auto";
		revampedKanbanContent.firstElementChild.remove();
		revampedKanbanContent.lastElementChild.remove();
		revampedKanbanHeader.firstElementChild.remove();
		revampedKanbanHeader.lastElementChild.remove();
		Array.from(revampedKanbanHeader.children).forEach((item) => {
			item.style.flexBasis = (100 / revampedKanbanHeader.children.length) + "%";
		});
		var closedText = document.createElement("p");
		closedText.innerText = "Closed";
		closedText.style.margin = "0px";
		closedText.style.padding = "16px 16px 4px";
		closedText.style.fontSize = "1rem";
		revamped.appendChild(closedText);
		revamped.appendChild(closedColumn);
		revamped.appendChild(revampedBoard);
		addStyleRule(`
      		.azure-board-focus--revamped .kanban-board-column-container {
        		min-height: 0px !important;
      		}
      		.azure-board-focus--revamped .kanban-board-row-header:empty {
        		padding: 0px !important;
      		}
      		.azure-board-focus--revamped .body-s {
      		  font-size: 1.25rem;
      		}
	  		.azure-board-focus--revamped .annotations {
      		  margin-top: auto;
      		}
			.azure-board-focus--revamped .field-container :is(.label, .value) {
      		  width: auto !important;
      		}
			.azure-board-focus--revamped .field-container .value {
      		  margin-left: 4px;
      		}
			.azure-board-focus--revamped .bolt-pill {
      		  font-size: 1rem;
      		}
			.azure-board-focus--revamped .board-row-name {
      		  max-width: unset !important;
      		}
    	`);

		body.textContent = "";
		body.appendChild(normal);
		body.appendChild(focused);
		body.appendChild(revamped);
		addStyleRule(`
			.azure-board-focus-content--normal, .azure-board-focus-content--focused, .azure-board-focus-content--revamped {
        		overflow-x: auto;
      		}
		`);

		body.classList.add("azure-board-focus--focused");
		showFocusedView(true);
	}
} catch {
	alert("Sorry, something went wrong trying to focus an Azure Board");
}

function showNormalView() {
	unexpandBoardColumns();
	body.setAttribute("data-indicesOfExpanded", "[]");
	getNormal().style.display = "flex";
	getFocused().style.display = "none";
	getRevamped().style.display = "none";
}

function showFocusedView(isInitial = false) {
	if (!isInitial) {
		expandBoardColumns();
	}
	window.addEventListener("beforeunload", unexpandBoardColumns, { once: true });
	getNormal().style.display = "none";
	getFocused().style.display = "flex";
	getRevamped().style.display = "none";
}

function showRevampedView() {
	getNormal().style.display = "none";
	getFocused().style.display = "none";
	getRevamped().style.display = "flex";
}

function addStyleRule(code) {
	var style = document.createElement("style");
	if (style.styleSheet) {
		style.styleSheet.cssText = code;
	} else {
		style.innerHTML = code;
	}
	document.getElementsByTagName("head")[0].appendChild(style);
}

function getNormal() {
	return document.getElementsByClassName("azure-board-focus-content--normal")[0];
}

function getFocused() {
	return document.getElementsByClassName("azure-board-focus-content--focused")[0];
}

function getRevamped() {
	return document.getElementsByClassName("azure-board-focus-content--revamped")[0];
}

function expandBoardColumns() {
	var indicesOfExpanded = [];
	Array.from(document.getElementsByClassName("kanban-board-row-container")[0].children).forEach((row, i) => {
		if (!row.classList.contains("expanded")) {
			row.firstElementChild.click();
			indicesOfExpanded.push(i);
		}
	});
	body.setAttribute("data-indicesOfExpanded", JSON.stringify(indicesOfExpanded));
	window.addEventListener("beforeunload", unexpandBoardColumns, { once: true });
}

function unexpandBoardColumns() {
	var needsUnexpanding = JSON.parse(body.getAttribute("data-indicesOfExpanded"));
	Array.from(document.getElementsByClassName("kanban-board-row-container")[0].children).forEach((row, i) => {
		if (needsUnexpanding.includes(i) && row.classList.contains("expanded")) {
			row.firstElementChild.click();
		}
	});
}
