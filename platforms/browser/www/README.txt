This readme is used for explaining the structure of the project and some of the bugs in this project

PROJECT structure
www/
    index.html                                  - The main page of the app. Has a help button, start (record.html) and history (history.html) button
    record.html                                 - Used for recording the user's route, take pictures (add pins on the map) and
                                                    display the distance travelled. Stop button saves the data and goes back to index.html
    history.html                                - Displays a list of sessions saved from record.html.
                                                    Tap one to display the route taken, images taken and distance travelled
    js/
        googleMaps.js                           - Code for getting the GPS location. Adds a new GPS coordinates to the map and saves it behind the scenes.
                                                    Moves the map as the user moves.
                                                    Red pin is the user's location. Blue pin is where the user took a photo. Tap on it to view
        history.js                              - Used for generating the list of sessions in history.html, and displaying the selected sessions.
                                                    When the user selects a session to view, the map is displayed to view the route the user took in the past.
                                                    Also displays the distance travelled and adds pins of where the picture was taken.
        jquery-3.1.1.min.js                     - jQuery library
        materialize.js                          - materialize CSS framework javascript file. http://materializecss.com/
        materialize.min.js                      - Minified CSS framework javascript. http://materializecss.com/
        route.js                                - Used for defining a main structure of how the route data and picture data is stored.
                                                    There are two objects: 'pictureObject' and 'RouteObject'
                                                        * pictureObject: used for storing the latitude and longitude along with
                                                            the path to picture taken at that position. This object is then added to RouteObject
                                                        * RouteObject: used for storing an array of 'pictureObject' (array: picArray)
                                                            and another array for keeping track of the route the user took when the session
                                                            was being recorded (array: routeArray)
                                                    There's also three functions: addPic, addRoute, drawRoute
                                                        * addPic: a helper function to simply add the captured picture to 'picArray'
                                                        * addRoute: helper function to add the GPS coordinates to 'routeArray' when the user moves
                                                        * drawRoute: draws a blue line indicating where the user walked. Uses 'routeArray' to draw the line
        store.min.js                            - used to store RouteObject to local storage
        structure.js                            - used for 'record.html'.
                                                    Loads the map when record.html is opened.
                                                    Has the following functions:
                                                        * stopRecording: tells geolocation to stop watching and save RouteObject to local storage using store.js
                                                        * takePhoto: takes a photo, gets the GPS coordinates at the time calls addPic (in route.js) and
                                                            adds a blue pin to the map. An action listener is added for each of the blue pins. Tapping on the
                                                            blue pin will open the image taken at that location
    css/
        jquery.mobile.structure-1.4.5.min.css   - jQuery mobile basic CSS
        materialize.css                         - materialize CSS framework CSS file. http://materializecss.com/
        materialize.min.css                     - Minified materialize CSS framework CSS file. http://materializecss.com/
        personal.css                            - My own CSS to fine tune the pages


BUGS in the application
- Storage:
    * for some reason store.js will NOT save the RouteObject using store.js
    * When I retrieve the data in history.html (when a user selects a session), the data retrieved is undefined.
    * I tried using window.localStorage, but it will lose all the array information in RouteObj.
    * So I tried converting the object to JSON object and store that.
      > I only have floating point values for Latitude and Longitude and string for the file path
    * But converting to JSON also removes all the data in RouteObj
    * So I have no way of storing the data for each session of the user.
- Opening an image after taken
    * When you open the image (tapping blue pin after picture is taken), the image is displayed correctly.
    * But when you open the same image or another image, the image width gets reduced for some reason.
    * I tried debugging this, but I'm not sure where is the problem is coming from.
