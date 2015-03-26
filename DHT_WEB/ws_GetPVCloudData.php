<?php

error_reporting(E_ERROR);

class WebServiceClass {

    /**
     * 
     * @return be_session
     */
    public static function GetPVCloudData() {

        $url = "http://costaricamakers.com/pvcloud_backend/vse_get_value_last.php?account_id=1&app_id=16&api_key=9c04d1bf0cb4b6409202b68495ebc06110011208&optional_label=DHT11_READING";
        
        $result = file_get_contents($url);

        return $result;
    }

}

$result = WebServiceClass::GetPVCloudData();

header("Access-Control-Allow-Origin: *");
header('Content-Type: application/json');
echo $result;