/**
 * Defines the ImageLabeling.Answer class
 */
(function ($, ImageLabeling) {

    /**
     * Creates a new draggable answer to drop at the appropriate label 
     *
     * @class
     * @namespace H5P.ImageLabeling
     * @param  {Object} config
     * @param  {Object} options
     * @param  {number} id
     * @param  {boolean} isSmallDeviceCB
     * @param  {H5P.ImageLabeling} parent
     */

    ImageLabeling.Answer = function (config, options, id, isSmallDeviceCB, parent) {
        var self = this;
        this.config = config;
        this.visible = false;
        this.id = id;
        this.isSmallDeviceCB = isSmallDeviceCB;
        this.options = options;


        //Checks if the answer is invaild and takes approriate action
        if (this.config.answer === undefined || this.config.answer === null) {
            throw new Error('Missing answers options');
        }


        var draggableAnswerID = "dragtarget_" + (this.config.answer).replace(/ /g, "_");           // creates a different id for different draggable answer

        var dropzoneID = "dropzone_" + this.config.position.y + "x" + this.config.position.x;      // creates a different id for different dropzone   


        //creates the draggables with appropriate answers, styles and ids  
        this.$element = $('<div />', {
            'text': this.config.answer,
            'class': 'h5p-image-hotspot-answer-draggable',
            'id': draggableAnswerID
        });



        jQuery(function () {
            jQuery('#' + draggableAnswerID).draggable({                                           //makes all the answers draggable

                revert: true,                                                                     //puts it back to the intial position if not dropped in any dropzones
                revertDuration: 800,                                                              //duration it takes to revert back to initial position

                start: function (event, ui) {
                    $('.h5p-image-hotspot-popup').attr('style', 'visibility : visiable');

                },
                stop: function (event, ui) {
                    $('.h5p-image-hotspot-popup').attr('style', 'visibility : hidden');
                }
            })

            jQuery('#' + dropzoneID).droppable({                                                  //makes all the dropzone droppable 


                drop: function (event, ui) {                                                     //appends the draggble answers to the dropzones after being dropped


                    if ($('#' + $('#' + dropzoneID).children().first().attr('id')).parents('#' + dropzoneID).length != 1) {        //Checks if the dropzone has any drobbable on it. if no, drop event triggers!

                        $('#' + dropzoneID).text($(ui.draggable).text());
                        $('#' + dropzoneID).removeClass("h5p-image-hotspot-popup");
                        $('#' + dropzoneID).append($('#' + ui.draggable.attr('id')).attr('style', 'visibility: hidden'));

                        //creates a click function to clear the dropzone when dropzone are clicked. 

                        if ($('#' + $('#' + dropzoneID).children().first().attr('id')).parents('#' + dropzoneID).length == 1) {        //Checks if the dropzone has any drobbable on it. if yes, mouse click event triggers!

                            $('#' + dropzoneID).click(function () {
                                $('#' + dropzoneID).addClass( "h5p-image-hotspot-popup" );
                                var detached = $('#' + $('#' + dropzoneID).children().attr('id')).detach();
                                detached = detached.removeAttr('style');
                                detached = detached.attr('style', 'position: relative');
                                $('.h5p-image-hotspot-answer-container').append(detached);
                                $('#' + dropzoneID).html("");
                            })

                        }

                    }


                }
            });
        });

    }


    //Appends everything into the main container 
    ImageLabeling.Answer.prototype.appendTo = function ($container) {
        this.$container = $container;
        this.$element.appendTo($container);
    };

})(H5P.jQuery, H5P.ImageLabeling);

