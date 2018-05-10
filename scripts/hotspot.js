/**
 * Defines the ImageLabeling.Hotspot class
 */
(function ($, ImageLabeling) {


    /**
     * Creates a new Hotspot
     *
     * @class
     * @namespace H5P.ImageLabeling
     * @param  {Object} config
     * @param  {Object} options
     * @param  {number} id
     * @param  {boolean} isSmallDeviceCB
     * @param  {H5P.ImageLabeling} parent
     */

    ImageLabeling.Hotspot = function (config, options, id,isSmallDeviceCB, parent) {
        var self = this;
        this.config = config;
        this.visible = false;
        this.id = id;
        this.isSmallDeviceCB = isSmallDeviceCB;
        this.options = options;


        //Checks if the coordinates of the hotpots in the picture are invalid and takes appropriate action
        if (this.config.position === undefined || this.config.position.length === 0) {
            throw new Error('Missing content configuration for hotspot. Please fix in editor.');
        }



        var buttonID = "button" + this.config.position.y + "x" + this.config.position.x;            //creates a different id for different hotpot buttons, which is a indication of a dropzone being present there
        
        var dropzoneID = "dropzone_" + this.config.position.y + "x" + this.config.position.x;      // creates a different id for different dropzone   



        //creates a button at every hotpots coordinate along with a dropzone which is initially hidden
        this.$element = $('<button/>', {
            'class': 'h5p-image-hotspot',
            'id': buttonID
        }).append($('<div/>', {
            'class': 'h5p-image-hotspot-popup',
            'id': dropzoneID,
            'style': 'visibility : hidden',
        })).css({
            top: this.config.position.y + '%',
            left: this.config.position.x + '%',
            color: options.color
        });



        this.$element.mouseover(function () {

            if ($('#' + $('#' + dropzoneID).children().first().attr('id')).parents('#' + dropzoneID).length != 1) {          // Checks if the dropzone has any draggable on it. if no, mouseover event triggers!

                $('#' + dropzoneID).attr('style', 'visibility : visiable');
            }


        });



        this.$element.mouseout(function () {

            if ($('#' + $('#' + dropzoneID).children().first().attr('id')).parents('#' + dropzoneID).length != 1) {         // Checks if the dropzone has any drobbable on it. if no, mosueout event triggers!

                $('#' + dropzoneID).attr('style', 'visibility : hidden');
            }
        });



    }


    //Appends everything into the main container 
    ImageLabeling.Hotspot.prototype.appendTo = function ($container) {
        this.$container = $container;
        this.$element.appendTo($container);
    };

})(H5P.jQuery, H5P.ImageLabeling);
