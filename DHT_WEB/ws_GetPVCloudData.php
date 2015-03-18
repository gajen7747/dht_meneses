<?php

error_reporting(E_ERROR);

class WebServiceClass {

    /**
     * 
     * @return be_session
     */
    public static function GetPVCloudData() {
        
        $api_key = "9c04d1bf0cb4b6409202b68495ebc06110011208";
        $device_id = 16; //Jose's Galileo
        $account_id = 1; //Jose's Account
        $url = "https://costaricamakers.com/pvcloud_backend/vse_get_value_last.php?account_id=$account_id";
        $url .= "&device_id=$device_id";
        $url .= "&api_key=$api_key";
        $url .= "&optional_label=DHT11_READING";
        
        $result = file_get_contents($url);

        return $result;
    }


}

$result = WebServiceClass::GetPVCloudData();

header("Access-Control-Allow-Origin: *");
header('Content-Type: application/json');
echo $result;
