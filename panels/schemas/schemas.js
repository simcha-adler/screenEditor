import { themeSchema } from "./theme.js";
import { animationsSchema } from "./animation.js";
import { bordersSchema } from "./borders.js";
import { classesSchema } from "./classes.js";
import { designSchema } from "./design.js";
import { layoutSchema } from "./layout.js";
import { positionSchema } from "./position.js";
import { settingsSchema } from "./settings.js";
import { addElementSchema } from "./addElement.js";
import { elementsList } from "./elementList.js";
import { viewSchema } from "./view.js";


export const schemas = {
    theme: themeSchema,
    animations: animationsSchema,
    borders: bordersSchema,
    classes: classesSchema,
    design: designSchema,
    layout: layoutSchema,
    position: positionSchema,
    settings: settingsSchema,
    addElement: addElementSchema,
    view: viewSchema,
    elementsList: elementsList
}

window.schemas = schemas;
