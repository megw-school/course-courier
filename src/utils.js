// Utiltiy Functions

// downloadObjectAsJson copied from StackOverflow answer
// All credit goes to: https://stackoverflow.com/a/30800715
// Much obliged *hat tip*
function downloadObjectAsJson(exportObj, exportName){
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj));
    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", exportName + ".json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}

function formatCourseTree(course_data) {
    let course_tree = [];
    let expand_all = [];
    let check_all = [];

    for (let key1 in course_data) {
        let course = course_data[key1];
        let cats = [];

        for (let key2 of course) {
            cats.push({label: key2, value: key1 + '//' + key2});
            check_all.push(key1 + '//' + key2)
        }

        course_tree.push({label: key1, value: key1, children: cats})
        expand_all.push(key1)
    }

    return [course_tree, expand_all, check_all];
}


function formatReviewTree(assignments, config) {
    assignments = assignments.sort(function(a, b){return a.week_id - b.week_id});
    const findInTree = (arr, value) => {
        return arr.findIndex(obj => obj.value === value);
    };

    let space_label, space_value, space_ind, list_label, list_value, list_ind, task_label, task_value;
    let expand_all = [];
    let space_tree = [];
    let tasks =[];
    for (let el of assignments) {
        // Add/Update Space
        // Was a space configuration provided?
        space_label = (config.space !== 'none') ? 'Space -- '+el[config.space] : "Space -- Canvas (Course Courier)";
        space_value = (config.space !== 'none') ? el[config.space+'_id'] : "default";

        // check if we need to add this label to the tree
        if (findInTree(space_tree, space_value) < 0) {
            space_tree.push({label: space_label, value: space_value, children: []});
            expand_all.push(space_value);
        }
        space_ind = findInTree(space_tree, space_value);

        // Add/Update List
        // Was a space configuration provided?
        list_label = (config.list !== 'none') ? 'List -- '+el[config.list] : "List -- Assignments";
        list_value = space_value+'//'+((config.list !== 'none') ? el[config.list+'_id'] :  "default");

        // check if we need to add this label to the tree
        if (findInTree(space_tree[space_ind].children, list_value) < 0) {
            space_tree[space_ind].children.push({label: list_label, value: list_value, children: []});
            expand_all.push(list_value);
        }
        list_ind = findInTree(space_tree[space_ind].children, list_value);

        // Add Task
        // Was a space configuration provided?
        task_label = 'Task -- '+el['name'];
        task_value = list_value+'//'+el['id'];
        tasks.push(el['id']);

        if (config.space === 'none') {
            space_tree[space_ind].children[list_ind].children.push({label: task_label, value: task_value});
            expand_all.push(task_value);
            tasks.push(task_value);

        } else {
            space_tree[space_ind].children[list_ind].children.push({label: task_label, value: task_value,
                children: [{
                    label: 'Tag -- '+el[config.tag],
                    value: task_value+'//'+el[config.tag+'_id']}]
            });
            expand_all.push(task_value);

        }
    }

    return [space_tree, expand_all, tasks];
}

export {downloadObjectAsJson as default, formatCourseTree, formatReviewTree};