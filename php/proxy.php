<?PHP
require 'vendor/autoload.php';

use Guzzle\Http\Client;

$client = new Client('http://10.111.8.14:80');
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
	   //var_dump($response->getBody(TRUE));
	   header("Content-type: application/json; charset=utf-8");
	   print $response->getBody(TRUE);
?>
