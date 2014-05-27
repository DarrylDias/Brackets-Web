/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, $, brackets, unescape, window */

define(function (require, exports, module) {
    "use strict";
    
    var Commands                = brackets.getModule("command/Commands"),
        CommandManager          = brackets.getModule("command/CommandManager"),
        Menus                   = brackets.getModule("command/Menus"),
        KeyBindingManager       = brackets.getModule("command/KeyBindingManager"),
        DocumentManager         = brackets.getModule("document/DocumentManager"),
        ProjectManager          = brackets.getModule("project/ProjectManager"),
        Dialogs                 = brackets.getModule("widgets/Dialogs"),
        StringUtils             = brackets.getModule("utils/StringUtils"),
        Strings                 = require("strings");
    
    /**
     * List of constants for command IDs.
     */
    // FILE
    exports.FILE_DELETE         = "node.file.delete";
            
    function removeMenuItemAndKeyBindings(menuId, commandId) {
        var menu = Menus.getMenu(menuId),
            cmd = CommandManager.get(commandId),
            bindings = KeyBindingManager.getKeyBindings(commandId);
        
        bindings.forEach(function (value, index) {
            KeyBindingManager.removeBinding(value.key);
        });
        menu.removeMenuItem(commandId);
    }
    
    function getErrorMessage(errorCode) {
        if (errorCode) {
            var message = Strings["ERROR_CODE_" + errorCode];
            if (message) {
                return message;
            }
        }
        return errorCode;
    }
    
    function showYesNoDialog(title, message, itemPath, callback) {
        Dialogs.showModalDialog(
            "yes-no-dialog",
            title,
            StringUtils.format(message, StringUtils.htmlEscape(itemPath))
        ).done(function (id) {
            if (id === "yes") {
                callback();
            }
        });
    }
    
    function showErrorDialog(title, message, itemPath, err) {
        Dialogs.showModalDialog(
            Dialogs.DIALOG_ID_ERROR,
            title,
            StringUtils.format(message, StringUtils.htmlEscape(itemPath),
                               StringUtils.htmlEscape(getErrorMessage(err.code)))
        );
    }
    
    function updateNavigation(entry) {
        ProjectManager.showInTree(entry)
            .done(function (selected) {
                var treeAPI = $.jstree._reference($("#project-files-container"));
                treeAPI.remove(selected);
            });
    }
    
    // Remove menu items and key bindings that don’t make sense when Brackets is used in client / server scenario.
    removeMenuItemAndKeyBindings(Menus.AppMenuBar.FILE_MENU, Commands.FILE_OPEN);
    removeMenuItemAndKeyBindings(Menus.AppMenuBar.FILE_MENU, Commands.FILE_OPEN_FOLDER);
    
    // Add new menu items
    var menu = Menus.getMenu(Menus.AppMenuBar.FILE_MENU);
    CommandManager.register("Delete", exports.FILE_DELETE, function () {
        var entry = ProjectManager.getSelectedItem();
        if (!entry) {
            var doc = DocumentManager.getCurrentDocument();
            entry = doc && doc.file;
        }
        if (entry.isFile === true) {
            showYesNoDialog(Strings.DELETE_FILE_TITLE,
                            Strings.DELETE_FILE_MESSAGE,
                            entry.fullPath,
                            function () {
                    brackets.fs.unlink(entry.fullPath, function (err) {
                        if (err) {
                            showErrorDialog(Strings.ERROR_DEL_FILE_TITLE,
                                            Strings.ERROR_DEL_FILE_MESSAGE,
                                            entry.fullPath,
                                            err
                                           );
                        } else {
                            DocumentManager.notifyFileDeleted(entry);
                            updateNavigation(entry);
                        }
                    });
                });
        } else if (entry.isDirectory === true) {
            showYesNoDialog(Strings.DELETE_FOLDER_TITLE,
                            Strings.DELETE_FOLDER_MESSAGE,
                            entry.fullPath,
                            function () {
                    brackets.fs.rmdirRecursive(entry.fullPath, function (err) {
                        if (err) {
                            showErrorDialog(Strings.ERROR_DEL_FOLDER_TITLE,
                                            Strings.ERROR_DEL_FOLDER_MESSAGE,
                                            entry.fullPath,
                                            err
                                           );
                        } else {
                            updateNavigation(entry);
                        }
                    });
                });
        }
    });
    
    menu.addMenuItem(exports.FILE_DELETE, "Ctrl-Alt-D", Menus.AFTER, Commands.FILE_CLOSE_ALL);
    var cmenu = Menus.getContextMenu(Menus.ContextMenuIds.PROJECT_MENU);
    cmenu.addMenuItem(exports.FILE_DELETE);
});