<?PHP
require 'vendor/autoload.php';

use Guzzle\Http\Client;

$client = new Client('https://manager.flexvdi.es:443');
       $request = $client->post(
         '/vdi/desktop',
         array(
           'content-type' => 'application/json',
         )
       );
       $request->setBody($_POST['data']);
	   $request->getCurlOptions()->set(CURLOPT_SSL_VERIFYHOST, false);
		$request->getCurlOptions()->set(CURLOPT_SSL_VERIFYPEER, false);
       $response = $request->send();
	   //var_dump($response);
	   header("Content-type: application/json; charset=utf-8");
	   print $response->getBody(TRUE);
?>