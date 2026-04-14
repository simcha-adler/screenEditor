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
    themeSchema: themeSchema,
    animationsSchema: animationsSchema,
    bordersSchema: bordersSchema,
    classesSchema: classesSchema,
    designSchema: designSchema,
    layoutSchema: layoutSchema,
    positionSchema: positionSchema,
    settingsSchema: settingsSchema,
    addElementSchema: addElementSchema,
    viewSchema: viewSchema,
    elementsList: elementsList
}

window.schemas = schemas;

window.themeSchema = themeSchema;
window.animationsSchema = animationsSchema;
window.bordersSchema = bordersSchema;
window.classesSchema = classesSchema;
window.designSchema = designSchema;
window.layoutSchema = layoutSchema;
window.positionSchema = positionSchema;
window.settingsSchema = settingsSchema;
window.addElementSchema = addElementSchema;
window.addElementSchema = addElementSchema;
window.viewSchema = viewSchema;
window.elementsList = elementsList;