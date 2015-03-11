<!doctype html>
<!--[if lt IE 7]>      <html class="no-js lt-ie9 lt-ie8 lt-ie7" lang=""> <![endif]-->
<!--[if IE 7]>         <html class="no-js lt-ie9 lt-ie8" lang=""> <![endif]-->
<!--[if IE 8]>         <html class="no-js lt-ie9" lang=""> <![endif]-->
<!--[if gt IE 8]><!--> <html class="no-js" lang=""> <!--<![endif]-->
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
        <title>DHT 11 over the Cloud</title>
        <meta name="description" content="">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="apple-touch-icon" href="apple-touch-icon.png">

        <link rel="stylesheet" href="css/bootstrap.min.css">
        <style>
            body {
                padding-top: 0;
                padding-bottom: 20px;
            }
        </style>
        <link rel="stylesheet" href="css/bootswatch-themes/flatly.css">
        <link rel="stylesheet" href="css/main.css">

        <script src="js/vendor/modernizr-2.8.3-respond-1.4.2.min.js"></script>
    </head>
    <body >
        <!-- HAPPY BROWSER -->
        <!--[if lt IE 8]>
            <p class="browserupgrade">You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> to improve your experience.</p>
        <![endif]-->

        <!-- JUMBOTRON WELCOME HEADER -->
        <div class="jumbotron">
            <div class="container">
                <h1>Welcome</h1>
                <p class="explanation">This page implements a simple demo on how to use DHT11 Humidity/Temperature sensor connected to an Intel Galileo IoT device, to send environmental data to a Cloud Service (pvCloud) and consume it in the form of visual warnings and email alerts.</p>
            </div>
        </div>

        <!--CONTENT-->
        <div class="container">
            <!-- UNIQUE ROW -->
            <div class="row">
                <!-- FIRST FLUID COLUMN (CONFIGURATION) -->
                <div class="col-md-4">
                    <h2>Configuration</h2>
                    <p  class="explanation">In this section you can provide the settings to be used as Temperature/Humidity alert triggers and email to be notified.</p>
                    <form>
                        <p title="Max Temperature in Celsius that triggers a visual warning" class="input-group" style="width:100%">
                            <label class="input-group-addon config-label" for="txtWarning_T_Trigger" style="width:200px; text-align: right">MAX TEMP WARNING:   </label>
                            <input class="form-control" type="number" min="0" max="90" value="32"  id="txtWarning_T_Trigger">
                            <label class="input-group-addon" for="txtWarning_T_Trigger" style="width:1em; text-align: right; color:orange"><i class="glyphicon glyphicon-fire"></i></label>
                        </p> 
                        <p title="Max Temperature in Celsius that triggers an Email Alert" class="input-group" style="width:100%">
                            <label class="input-group-addon  config-label" for="txtAlert_T_Trigger" style="width:200px; text-align: right">MAX TEMP ALERT:   </label>
                            <input class="form-control" type="number" min="0" max="90" value="38"  id="txtAlert_T_Trigger">
                            <label class="input-group-addon" for="txtAlert_T_Trigger" style="width:1em; text-align: right; color:red"><i class="glyphicon glyphicon-fire"></i></label>
                        </p> 
                        <p title="Min Humidity % that triggers a visual warning" class="input-group" style="width:100%">
                            <label class="input-group-addon  config-label" for="txtWarning_H_Trigger" style="width:200px; text-align: right">MIN HUMIDITY WARN:   </label>
                            <input class="form-control" type="number" min="20" max="80" value="40" id="txtWarning_H_Trigger">
                            <label class="input-group-addon" for="txtWarning_H_Trigger" style="width:1em; text-align: right; color:orange"><i class="glyphicon glyphicon-tint"></i></label>
                        </p> 
                        <p title="Min Humidity % that triggers an Email Alert" class="input-group" style="width:100%">
                            <label class="input-group-addon config-label" for="txtAlert_H_Trigger" style="width:200px; text-align: right">MIN HUMIDITY ALERT:   </label>
                            <input class="form-control" type="number" min="20" max="80" value="38"  id="txtAlert_H_Trigger">
                            <label class="input-group-addon" for="txtAlert_H_Trigger" style="width:1em; text-align: right; color:sienna"><i class="glyphicon glyphicon-tint"></i></label>
                        </p>  
                        <p class="input-group" style="width:100%"  title="Email address that will be notified">
                            <input class="form-control" type="email" id="txtAlertEmail" placeholder="type Alert email here">
                            <label class="input-group-addon" for="txtAlert_H_Trigger" style="width:1em; text-align: right; color:blue"><i class="glyphicon glyphicon-envelope"></i></label>
                        </p>                          
                    </form>
                </div>
                
                <!-- SECOND FLUID COLUMN (CONTROL) -->
                <div class="col-md-4">
                    <h2>Control</h2>
                    <p  class="explanation">In this section you can specify behavior of the system; including how often the system will pull data from pvCloud and an option to actually force data pull.</p>
                    <form>
                        <p class="input-group" style="width:100%">
                            <label class="input-group-addon" for="txtCheckTime" style="width:200px; text-align: right">Check time in seconds:   </label>
                            <input class="form-control" type="number" min="5" max="60" value="10"  id="txtCheckTime">
                            <label class="input-group-addon" for="txtCheckTime" style="width:1em; text-align: right; color:blue">
                                <i class="glyphicon glyphicon-time"></i>
                            </label>
                        </p>  
                    </form>
                    <p>
                        <a id="btnBegin" class="btn btn-success pull-right" role="button" disabled >please wait...</a>
                        <img id="imgClock" class="pull-left" src="img/p19498-1231353003.gif" style="display:none; margin-left:20px; margin-top:5px; width:2em;"><a id="btnStop"  class="btn btn-danger pull-right" role="button" >STOP</a>
                    </p>
                </div>
                
                <!-- THIRD FLUID COLUMN (VISUALIZATION) -->
                <div class="col-md-4">
                    <h2>Visualization</h2>
                    <p  class="explanation">This section demonstrate how a device can send data to pvCloud and a registered system interpret such data.</p>

                    <div class="panel panel-body panel-info" style="text-align: center">
                        <div class="col-md-6">
                            <span id="val_H" style="font-size:3em">--</span>%<br>
                            <i id="iconHumidity" class="glyphicon glyphicon-tint" style="color:gray; font-size: 3em"></i><br>
                            <span>HUMIDITY</span>
                        </div>
                        <div class="col-md-6">
                            <span id="val_T" style="font-size:3em">--</span> C
                            <br>
                            <i id="iconTemperature" class="glyphicon glyphicon-fire" style="color:gray; font-size: 3em"></i><br>
                            <span>TEMPERATURE</span>
                        </div>   
                        <div class="small" id="created_datetime"></div>
                    </div>
                </div>
            </div>
            
            <!-- FOOTER -->
            <footer style="text-align:center">
                <p><a href="https://costaricamakers.com" target="_blank">Student Project Hosted by costaricamakers.com</a></p>
            </footer>
        </div> <!-- /container -->        <script src="//ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.js"></script>
        
        <!--SCRIPTS-->
        <script>window.jQuery || document.write('<script src="js/vendor/jquery-1.11.2.js"><\/script>');</script>
        <script src="js/vendor/bootstrap.min.js"></script>
        <script src="js/main.js"></script>
    </body>
</html>
