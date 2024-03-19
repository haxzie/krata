// // This is the same actions available in the server

// import { patchUpdateProject } from "@/api/project";

// // Make sure to update the server with the same details once this is updated
// export const PROJECT_ACTIONS = {
//     UPDATE_STATE: "UPDATE_STATE",
//     UPDATE_TITLE: "UPDATE_TITLE",
//     UPDATE_FEATURES: "UPDATE_FEATURES",
//     UPDATE_FEATURE_ORDER: "UPDATE_FEATURE_ORDER",
//     DELETE_FEATURES: "DELETE_FEATURES",
//     UPDATE_DESCRIPTION: "UPDATE_DESCRIPTION",
//     UPDATE_COVER: "UPDATE_COVER",
// };

// export const syncFilename = async (projectId, action, payload) => {
//     try {
//         const { status, data } = await patchUpdateProject(projectId, {
//             action: PROJECT_ACTIONS.UPDATE_TITLE,
//             payload: filename
//         });
//         if( status === 200) {
//             console.log({ data })
//         }
//     } catch (error) {
//         console.error(error);
//     }
// }