
// Defines the H5P.ImageLabeling Class


H5P.ImageLabeling = (function ($, EventDispatcher) {

    // Constructor funtion 
    function ImageLabeling(options, id) {

        EventDispatcher.call(this);

        // Extend defaults with provided options
        this.options = $.extend(true, {}, {
            image: null,
            labelImageAltText: '',
            hotspots: []
        }, options);

        // Keep provided id.
        this.id = id;
        this.isSmallDevice = false;
    };

    // Extends the event dispatcher
    ImageLabeling.prototype = Object.create(EventDispatcher.prototype);
    ImageLabeling.prototype.constructor = ImageLabeling;

    /**
     * Attach fucntion called by H5P framework to insert H5P content into page
     * @param {jQuery} $container
     */

    ImageLabeling.prototype.attach = function ($container) {
        var self = this;
        self.$container = $container;



        //Checks if a valid image has been provided, and takes appropriate action  
        if (this.options.image === null || this.options.image === undefined) {
            $container.append('<div class="background-image-missing"> Please add an Image with labeling options </div>');
            return;
        }


        $container.addClass('h5p-imageLabeling-container');                                           //adds styles to the main container

        //adds NOTES at the top 
        this.$noteContainer = $('<ul/>', {
            'class': 'h5p-image-hotspot-note-container',
            'id' : 'note',
        }).append($('<li/>', {
            'text': 'Label all the possible options before submitting',
        }).append($('<li/>', {
            'text': 'Drop zones are visualized by a pen icon',
        }).append($('<li/>', {
            'text': 'To change your mind, click the dropzone and re-lable',
        }))));

        this.$noteContainer.appendTo($container);


        this.$hotspotContainer = $('<div/>', {                                              //creates a div container for image inside the main container
            'class': 'h5p-image-hotspots-container',
            'id' : 'note'
        });


        //Adds Image to the hotspotContainer
        if (this.options.image && this.options.image.path) {
            this.$image = $('<img/>', {
                'class': 'h5p-image-hotspots-background',
                src: H5P.getPath(this.options.image.path, this.id)
            }).appendTo(this.$hotspotContainer);

            // Set alt text of image
            if (this.options.labelImageAltText) {
                this.$image.attr('alt', this.options.labelImageAltText);
            }
            else {
                // Ignore image if no alternative text for assistive technologies
                this.$image.attr('aria-hidden', true);
            }
        }

        var isSmallDevice = function () {
            return self.isSmallDevice;
          };

        // Adds hotspots to the image
        var numHotspots = this.options.hotspots.length;
        this.hotspots = [];

        this.options.hotspots.sort(function (a, b) {
            // Sanity checks, move data to the back if invalid
            var firstIsValid = a.position && a.position.x && a.position.y;
            var secondIsValid = b.position && b.position.x && b.position.y;
            if (!firstIsValid) {
                return 1;
            }

            if (!secondIsValid) {
                return -1;
            }

            // Order top-to-bottom, left-to-right
            if (a.position.y !== b.position.y) {
                return a.position.y < b.position.y ? -1 : 1;
            }
            else {
                // a and b y position is equal, sort on x
                return a.position.x < b.position.x ? -1 : 1;
            }
        });


        for (var i = 0; i < numHotspots; i++) {
            try {
                var hotspot = new ImageLabeling.Hotspot(this.options.hotspots[i], this.options, this.id,isSmallDevice, self);
                hotspot.appendTo(this.$hotspotContainer);
                this.hotspots.push(hotspot);
            }
            catch (e) {
                H5P.error(e);
            }
        }

        this.$hotspotContainer.appendTo($container);




        //Adds answer to the container

        var answerMap = new Map();                                                                 // declares answer hashset to store answer with its corresponding coordinates
        var correctAnswers = 0;

        this.$AnswerContainer = $('<div/>', {                                                     // creates answer container div with specific styles
            'class': 'h5p-image-hotspot-answer-container',
        });

        for (var i = 0; i < numHotspots; i++) {
            try {
                var answer = new ImageLabeling.Answer(this.options.hotspots[i], this.options, this.id, isSmallDevice, self);
                answerMap.set(this.options.hotspots[i].position.y + "x" + this.options.hotspots[i].position.x, this.options.hotspots[i].answer.replace(/ /g, "_"));
                answer.appendTo(this.$AnswerContainer);


            }
            catch (e) {
                H5P.error(e);
            }
        }


        this.$AnswerContainer.appendTo($container);


        //adds check button to the contianer

        this.$CheckAnswerButton = $('<div/>', {
            'class': 'h5p-image-hotspot-checkButton-container'
        }).append($('<button/>', {
            'text': 'Check Answer',
            'class': 'button button1',
            'id': 'checkButton'
        }));

        this.$CheckAnswerButton.appendTo($container);


        //Checks user's answer with the correct answer 
        $('#checkButton').click(function () {

            correctAnswers = 0;
            for (var key of answerMap.keys()) {
                if ($("#dropzone_" + key).children().first().attr('id') == undefined) {        //Checks if the dropzone has a frist children with a valid id, if not it send messages to label all the options
                    alert("Please label all the options.");
                    return;

                }
                else {
                    if ($("#dropzone_" + key).children().first().attr('id').indexOf(answerMap.get(key)) > 0) {     // Checks if the dropzone first children id contains the corresponding answer. index of returns more than 0 if it contains. 
                        correctAnswers += 1;

                    }
                }
            }

            alert("You have got " + correctAnswers + " right out of " + numHotspots);
 
        })

    }

    return ImageLabeling;
})(H5P.jQuery, H5P.EventDispatcher);




