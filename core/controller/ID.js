function ID() {
    
};

ID.ID = 0;

ID.assignUniqueId = function() {
    ID.ID ++;
    return ID.ID.toString();
}