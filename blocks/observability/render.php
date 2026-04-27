{
    "$schema": "https://schemas.wp.org/trunk/block.json",
    "apiVersion": 3,
    "name": "observata/observability",
    "title": "Observability",
    "category": "theme",
    "description": "Observability section with graphic and 3 problem cards.",
    "supports": {
        "html": false,
        "multiple": false
    },
    "attributes": {
        "sectionTitle": {
            "type": "string",
            "default": ""
        }
    }
    },
    "render": "file:render.php",
    "editorScript": "file:../../build/index.js",
    "editorStyle": "file:../../build/index.css"
}
