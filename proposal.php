<?php

      if($_FILES['aerialView']['tmp_name'] === ''){
        $aerialView = 'placeholder.png';
      } else {
        move_uploaded_file($_FILES['aerialView']['tmp_name'], "UploadedImages/".$_FILES['aerialView']['name']);
        $aerialView = "UploadedImages/".$_FILES['aerialView']['name'];
      };

      if($_FILES['streetView']['tmp_name'] === ''){
        $streetView = 'placeholder.png';
      } else {
        move_uploaded_file($_FILES['streetView']['tmp_name'], "UploadedImages/".$_FILES['streetView']['name']);
        $streetView = "UploadedImages/".$_FILES['streetView']['name'];
      };

    $firstName = $_POST['firstName'];
    $firstNameBilling = $_POST['firstName'];
    $lastName = $_POST['lastName'];
    $lastNameBilling = $_POST['lastName'];
    $address = $_POST['address'];
    $city = $_POST['city'];
    $state = $_POST['state'];
    $zip = $_POST['zip'];
    $email = $_POST['email'];
    $phone = $_POST['phone'];
    $lawn = $_POST['lawnCuttingEstimate'];
    $fertilization = $_POST['fertilizationEstimate'];
      $fert4 = $_POST['fertilization4'];
      $fert6 = $_POST['fertilization6'];
    $grub = $_POST['grubControlEstimate'];
    $pest = $_POST['pestControlEstimate'];
      $pest3 = $_POST['pest3'];
      $pest5 = $_POST['pest5'];
    $mosquito = $_POST['mosquitoSprayEstimate'];
      $mosq3 = $_POST['mosquito3'];
      $mosq5 = $_POST['mosquito5'];
    $aeration = $_POST['aerationEstimate'];
      $coreFall = $_POST['aerationFall'];
      $coreSpring = $_POST['aerationSpring'];
    $detaching = $_POST['detachingEstimate'];
      $detSpring = $_POST['detachingSpring'];
      $detFall = $_POST['detachingFall'];
    $sprinklerStartUp = $_POST['sprinklerStartUpEstimateTotal'];
    $sprinklerShutDown = $_POST['sprinklerShutDownEstimateTotal'];
    $deepFertilization = "TBD";
    $deepRootFertFall = " ";
    $deepRootFertSpring = " ";
    $dormantOil = "TBD";
    $dormantOilFall = " ";
    $dormantOilSpring = " ";
    $hollyTone = "TBD";
    $weeding = "TBD";
    $insectControl = "TBD";

    if(isset($fert4)){
      $fert4 = '      X';
    } else {
      $fert4 = ' ';
    };

    if(isset($fert6)){
      $fert6 = '    X';
    } else {
      $fert6 = ' ';
    };

    if(isset($pest3)){
      $pest3 = '      X';
    } else{
      $pest3 = ' ';
    };

    if(isset($pest5)){
      $pest5= '    X';
    } else{
      $pest5 = ' ';
    };

    if(isset($mosq3)){
      $mosq3 = '     X';
    } else{
      $mosq3 = ' ';
    };

    if(isset($mosq5)){
      $mosq5 = '     X';
    } else{
      $mosq5 = ' ';
    };

    if(isset($coreSpring)){
      $coreSpring = '     X';
    } else{
      $coreSpring = ' ';
    };

    if(isset($coreFall)){
      $coreFall = '     X';
    } else{
      $coreFall = ' ';
    };

    if(isset($detFall)){
      $detFall = '    X';
    } else{
      $detFall = ' ';
    };

    if(isset($detSpring)){
      $detSpring = '    X';
    } else{
      $detSpring = ' ';
    };
 ?>
<?php
require('./fpdf/fpdf.php');

$pdf = new FPDF();
$pdf->AddPage();
$pdf->SetFont('helvetica','B',11);
$pdf->SetLineWidth(0.2);
//heading material
if($aerialView === 'placeholder.png'){
  $pdf->Image($streetView,10,10,84,40);
} elseif($streetView === 'placeholder.png'){
  $pdf->Image($aerialView,10,10,84,40);
} else {
  $pdf->Image($aerialView,10,10,44,40);
  $pdf->Image($streetView,50,10,44,40);
};
$pdf->Image('vlogo.png', 95, 13, 28);
$pdf->Image('address2019.png', 119, 12, 84);
// width, height, text, border, end line, align(optional)
$pdf->Cell(190,40,'',0,1); //dummy cell to align beyond header

$pdf->Cell(20,7,'',0,0);
$pdf->Cell(70,7,'BILLING NAME & ADDRESS',0,0);
$pdf->Cell(20,7,'',0,0);
$pdf->Cell(70,7,'PROPERTY NAME & ADDRESS',0,1); //end of line
//change to not bold, slightly smaller font
$pdf->SetFont('helvetica','',10);

$pdf->Cell(80,6,$firstNameBilling.' '.$lastNameBilling,0,0);
$pdf->Line(10,62,100,62);
$pdf->Cell(15,6,'',0,0);
$pdf->Cell(80,6,$firstName.' '.$lastName,0,1); //end of line
$pdf->Line(195,62,105,62);

$pdf->Cell(80,6,$address.' '.$city.' '.$state.' '.$zip,0,0); //Start adding 7 for line height & continue to add 7 for each drawn line
$pdf->Line(10,68,100,68);
$pdf->Cell(15,6,'',0,0);
$pdf->Cell(80,6,$address.' '.$city.' '.$state.' '.$zip,0,1); //end of line
$pdf->Line(195,68,105,68);

$pdf->Cell(80,6,'C: '.$phone,0,0);
$pdf->Line(10,74,100,74);
$pdf->Cell(15,6,'',0,0);
$pdf->Cell(80,6,'C: '.$phone,0,1); //end of line
$pdf->Line(195,74,105,74);

$pdf->Cell(80,6,'E: '.$email,0,0);
$pdf->Line(10,80,100,80);
$pdf->Cell(15,6,'',0,0);
$pdf->Cell(80,6,'E: '.$email,0,1); //end of line
$pdf->Line(195,80,105,80);

//dummy line for spacing
$pdf->Cell(190,2,'',0,1);

$pdf->SetFont('helvetica','B',10);
$pdf->SetFillColor(254, 254, 62);
$pdf->Cell(30,7,'',0,0,"C",true);
$pdf->Cell(130,7,'Please inital for requested services and number of applications.',0,0,"C",true);
$pdf->Cell(30,7,'',0,1,"C",true); //end of line

$pdf->SetFont('helvetica','B',9);
$pdf->Cell(148,4,'',0,0);
$pdf->Cell(21,4,'Price per',0,0,"C");
$pdf->Cell(21,4,'',0,1);
$pdf->Cell(148,4,'DESCRIPTION OF WORK TO BE PERFORMED:',0,0);
$pdf->Cell(21,4,' Service/',0,0,"C");
$pdf->Cell(21,4,'Initial',0,1,"C");
$pdf->Cell(148,4,'',0,0);
$pdf->Cell(21,4,' Application:',0,0,"C");
$pdf->Cell(21,4,'Here',0,1,"C");

$pdf->SetLineWidth(0.4);
$pdf->Line(10,102,200,102);

$pdf->SetLineWidth(0.2);
$pdf->Cell(36,7,'LAWN MAINTENANCE:',0,0);
$pdf->SetFont('helvetica', '', 9);
$pdf->Cell(38,7,' CUT, TRIM & EDGE WEEKLY',0,0);
$pdf->Cell(74,7,'',0,0);
$pdf->Cell(21,7,$lawn,0,0,"C");
$pdf->Line(159,108,179,108);
$pdf->Cell(21,7,'',0,1);
$pdf->Line(182,108,200,108);

$pdf->SetFont('helvetica','B',9);
$pdf->Cell(36,7,'WEEDING OF BEDS:',0,0);
$pdf->SetFont('helvetica','',9);
$pdf->Cell(38,7,'WEEKLY SERVICE $40.00 PER MAN HR',0,0);
$pdf->Cell(74,7,'',0,0);
$pdf->Cell(21,7,'TBD',0,0,"C");
$pdf->Line(159,115,179,115);
$pdf->Cell(21,7,'',0,1);
$pdf->Line(182,115,200,115);

$pdf->SetFont('helvetica','B',9);
$pdf->Cell(84,7,'LAWN FERTILIZATION/WEED CONTROL PROGRAM:',0,1);

$pdf->SetFont('helvetica','',9);
$pdf->Cell(74,7,'',0,0);
$pdf->Cell(17,7,'4 APPS',0,0,"C");
$pdf->Line(100,129,116,129);
$pdf->Cell(21,7,$fert4,0,0);
$pdf->Cell(16,7,'6 APPS',0,0);
$pdf->Line(136,129,152,129);
$pdf->Cell(21,7,$fert6,0,0);
$pdf->Cell(21,7,$fertilization,0,0,"C");
$pdf->Line(159,129,179,129);
$pdf->Cell(21,7,'',0,1);
$pdf->Line(182,129,200,129);

$pdf->SetFont('helvetica','B',9);
$pdf->Cell(75,7,'GRUB CONTROL:',0,0);
$pdf->SetFont('helvetica','',9);
$pdf->Cell(74,7,'ANNUAL APPLICATION',0,0);
$pdf->Cell(21,7,$grub,0,0,"C");
$pdf->Line(159,136,179,136);
$pdf->Cell(21,7,'',0,1);
$pdf->Line(182,136,200,136);

$pdf->SetFont('helvetica','B',9);
$pdf->Cell(54,7,'TREE & SHRUB CARE PROGRAM:',0,0);
$pdf->SetFont('helvetica','',9);
$pdf->Cell(86,7,'(CONTACT OUR OFFICE IF A DIAGNOSIS IS REQUIRED) ',0,1);

$pdf->Cell(21,7,'',0,0);
$pdf->Cell(53,7,'DORMANT OIL',0,0);
$pdf->Cell(17,7,'SPRING',0,0,"C");
$pdf->Line(100,150,116,150);
$pdf->Cell(21,7,' ',0,0);
$pdf->Cell(16,7,'FALL',0,0);
$pdf->Line(136,150,152,150);
$pdf->Cell(21,7,' ',0,0,"C");
$pdf->Cell(21,7,'TBD',0,0,"C");
$pdf->Line(159,150,179,150);
$pdf->Cell(21,7,'',0,1);
$pdf->Line(182,150,200,150);

$pdf->Cell(21,7,'',0,0);
$pdf->Cell(53,7,'INSECT & DISEASE CONTROL',0,0);
$pdf->Cell(37,7,'  3 APPLICATION PROGRAM',0,0);
$pdf->Cell(38,7,' ',0,0);
$pdf->Cell(21,7,'TBD',0,0,"C");
$pdf->Line(159,157,179,157);
$pdf->Cell(21,7,'',0,1);
$pdf->Line(182,157,200,157);

$pdf->Cell(21,7,'',0,0);
$pdf->Cell(53,7,'HOLLYTONE (FOR EVERGREENS)',0,0);
$pdf->Cell(37,7,'  3 APPLICATION PROGRAM',0,0);
$pdf->Cell(38,7,' ',0,0);
$pdf->Cell(21,7,'TBD',0,0,"C");
$pdf->Line(159,164,179,164);
$pdf->Cell(21,7,'',0,1);
$pdf->Line(182,164,200,164);

$pdf->Cell(21,7,'',0,0);
$pdf->Cell(53,7,'DEEP ROOT FERTILIZATION',0,0);
$pdf->Cell(17,7,'SPRING',0,0,"C");
$pdf->Line(100,171,116,171);
$pdf->Cell(21,7,' ',0,0);
$pdf->Cell(16,7,'FALL',0,0);
$pdf->Line(136,171,152,171);
$pdf->Cell(21,7,' ',0,0,"C");
$pdf->Cell(21,7,'TBD',0,0,"C");
$pdf->Line(159,171,179,171);
$pdf->Cell(21,7,'',0,1);
$pdf->Line(182,171,200,171);

$pdf->SetFont('helvetica','B',9);
$pdf->Cell(74,7,'HOME PERIMETER PEST CONTROL SPRAY:',0,1);
$pdf->SetFont('helvetica','',9);
$pdf->Cell(74,3,'(Helps prevent infiltration of the home by outdoor',0,1);
$pdf->Cell(74,3,'insects such as ants & spiders)',0,0);
$pdf->Cell(17,7,'3 APPS',0,0,"C");
$pdf->Line(100,188,116,188);
$pdf->Cell(21,7,$pest3,0,0);
$pdf->Cell(16,7,'5 APPS',0,0);
$pdf->Line(136,188,152,188);
$pdf->Cell(21,7,$pest5,0,0);
$pdf->Cell(21,7,$pest,0,0,"C");
$pdf->Line(159,188,179,188);
$pdf->Cell(21,7,'',0,1);
$pdf->Line(182,188,200,188);

$pdf->SetFont('helvetica','B',9);
$pdf->Cell(74,5,'MOSQUITO SPRAY:',0,1);

$pdf->SetFont('helvetica','',9);
$pdf->Cell(74,5,'(Helps to decrease the presence of Mosquitos)',0,0);
$pdf->Cell(17,7,'3 APPS',0,0,"C");
$pdf->Line(100,200,116,200);
$pdf->Cell(21,7,$mosq3,0,0);
$pdf->Cell(16,7,'5 APPS',0,0);
$pdf->Line(136,200,152,200);
$pdf->Cell(21,7,$mosq5,0,0);
$pdf->Cell(21,7,$mosquito,0,0,"C");
$pdf->Line(159,200,179,200);
$pdf->Cell(21,7,'',0,1);
$pdf->Line(182,200,200,200);

$pdf->SetFont('helvetica','B',9);
$pdf->Cell(74,7,'CORE AERATION:',0,0);
$pdf->SetFont('helvetica','',9);
$pdf->Cell(17,7,'SPRING',0,0,"C");
$pdf->Line(100,207,116,207);
$pdf->Cell(21,7,$coreSpring,0,0);
$pdf->Cell(16,7,'FALL',0,0);
$pdf->Line(136,207,152,207);
$pdf->Cell(21,7,$coreFall,0,0);
$pdf->Cell(21,7,$aeration,0,0,"C");
$pdf->Line(159,207,179,207);
$pdf->Cell(21,7,'',0,1);
$pdf->Line(182,207,200,207);

$pdf->SetFont('helvetica','B',9);
$pdf->Cell(74,7,'DE-THATCHING:',0,0);
$pdf->SetFont('helvetica','',9);
$pdf->Cell(17,7,'SPRING',0,0,"C");
$pdf->Line(100,214,116,214);
$pdf->Cell(21,7,$detSpring,0,0);
$pdf->Cell(16,7,'FALL',0,0);
$pdf->Line(136,214,152,214);
$pdf->Cell(21,7,$detFall,0,0);
$pdf->Cell(21,7,$detaching,0,0,"C");
$pdf->Line(159,214,179,214);
$pdf->Cell(21,7,'',0,1);
$pdf->Line(182,214,200,214);

$pdf->SetFont('helvetica','B',9);
$pdf->Cell(75,7,'SPRINKLER SYSTEM:',0,0);
$pdf->SetFont('helvetica','',8);
$pdf->Cell(75,7,'SPRING STARTUP, INSPECTION AND ADJUSTMENT',0,0);
$pdf->SetFont('helvetica','',9);
$pdf->Cell(21,7,$sprinklerStartUp,0,0,"C");
$pdf->Line(159,221,179,221);
$pdf->Cell(21,7,'',0,1);
$pdf->Line(182,221,200,221);

$pdf->Cell(75,7,'',0,0);
$pdf->SetFont('helvetica','',8);
$pdf->Cell(75,7,'FALL WINTERIZATION',0,0);
$pdf->SetFont('helvetica','',9);
$pdf->Cell(21,7,$sprinklerShutDown,0,0,"C");
$pdf->Line(159,228,179,228);
$pdf->Cell(21,7,'',0,1);
$pdf->Line(182,228,200,228);

$pdf->SetFont('helvetica','B',9);
$pdf->Cell(150,7,'SPRING CLEAN UP: $40 per man hour plus $40 disposal fee and 1 cut at regular charge ($200 min.)*',0,0);
$pdf->Cell(21,7,'',0,0);
$pdf->Cell(21,7,'',0,1);
$pdf->Line(182,235,200,235);

$pdf->Cell(150,7,'FALL CLEAN UP: $40 per man hour plus $40 disposal fee and 1 cut at regular charge ($200 min.)*',0,0);
$pdf->Cell(21,7,'',0,0);
$pdf->Cell(21,7,'',0,1);
$pdf->Line(182,242,200,242);

$pdf->Cell(150,7,'SHRUB TRIMMING: $40 per man hour and $40 disposal fee ($200 min.)*',0,1);

$pdf->SetFont('helvetica','',9);
$pdf->Cell(109,6,'',0,0);
$pdf->Cell(38,6,'LATE SPRING/EARLY SUMMER',0,0);
$pdf->Cell(21,6,'',0,0);
$pdf->Cell(21,6,'',0,1);
$pdf->Line(182,255,200,255);

$pdf->Cell(109,6,'',0,0);
$pdf->Cell(38,6,'LATE SUMMER/EARLY FALL',0,0);
$pdf->Cell(21,6,'',0,0);
$pdf->Cell(21,6,'',0,1);
$pdf->Line(182,261,200,261);

$pdf->SetFont('helvetica','B',9);
$pdf->Cell(190,7,'*cleanups and shrub trimming $55 per man hour plus $55 disposal fee ($300 Min.) if not lawn customer',0,1,"C");

$pdf->SetFont('helvetica','B',10);
$pdf->SetFillColor(254, 254, 62);
$pdf->Cell(30,7,'',0,0,"C",true);
$pdf->Cell(130,7,'SIGNATURE REQUIRED ON PAGE 2',0,0,"C",true);
$pdf->Cell(30,7,'',0,1,"C",true); //end of line


/*----------PAGE 2---------------*/
$pdf->SetFont('helvetica','B',12);
$pdf->Cell(190,7,'TERMS & CONDITIONS:',0,1);

$pdf->SetFont('helvetica','',11);

$pdf->Multicell(190,6,'By signing this contract, the customer authorizes all work initialed to be performed by Victory Lawnscape,
LLC or its subcontractors. This agreement will begin March 15, 2018. Said work will continue to be per-
formed by Victory until said services are canceled by either party. Victory reserves the right to cancel this
contract at any time. In addition, this contract can be canceled at any time by the customer by providing
Victory 48 hours notice in writing of your intent to cancel the contract.', 0, J, false);

$pdf->Cell(190,7,'',0,1);

$pdf->Multicell(190,6,'Victory is not responsible for damage to underground plumbing or wiring of any kind. Furthermore, Victory
will not be liable for sprinkler heads damaged due to improper installation or malfunction. Any damages to
customer property that occur while Victory crews are on site, must be reported to Victory within 48 hours by
contacting our office. All damages will be assessed regarding the extent of our responsibility, then repairs
will be made or customer will be reimbursed. Damages must be reported before repairs are made or the
reimbursement of costs will be subject to denial.', 0, J, false);

$pdf->Cell(190,7,'',0,1);

$pdf->Multicell(190,6,'If customer wishes to skip a service, a 48 HOUR NOTICE is required. Sprinklers must NOT be run on
scheduled cut day. Cut day is subject to change due to inclement weather and holidays. Routes/cut days
are set according to geographic location and are subject to change.', 0, J, false);

$pdf->Cell(190,7,'',0,1);

$pdf->Multicell(190,6,'All fertilization, aeration, and sprinkler services are performed by independent contractors that Victory
works with. All sprinkler repair services will be billed separately as labor and materials. You will still be
billed by Victory for these services rendered, and any all issues relating to this work should still be ad-
dressed with Victory. With respect to the tree and shrub work done at your home, this work refers to
shrubs, ornamental trees, and trees 40 feet and under only. Natural / wooded areas are not included in
these application prices.', 0, J, false);

$pdf->Cell(190,7,'',0,1);

$pdf->Multicell(190,6,'From time to time you may be charged additionally for services in the event either of the following occur:
First, if it is a first time cut for new sod or if we cut sod that has excessive growth, an additional charge for
the time spent cutting that lawn plus a $40 disposal fee will be added to the invoice. Second, a 5% fuel sur-
charge will be added for each month when the average cost of fuel for the month is over $3.00 per gallon.', 0, J, false);

$pdf->Cell(190,7,'',0,1);
$pdf->SetFont('helvetica','B',12);
$pdf->Cell(190,7,'PAYMENT TERMS:',0,1);

$pdf->SetFont('helvetica','',11);

$pdf->Multicell(190,6,'We do monthly autopay using a credit card or debit card that you provide to us. By
using this method, you agree to allow us to charge your credit or debit card on a monthly basis for
any and all work that was performed that month. Said payment will be taken between the 1st and
5th day of the following month for any and all work that was performed the prior month.', 0, J, false);

$pdf->Cell(190,7,'',0,1);
$pdf->SetFont('helvetica','B',14);
$pdf->Cell(190,7,'No work will be performed without prior written authorization.',0,1);
$pdf->Cell(190,7,'',0,1);
$pdf->SetFont('helvetica','',14);

$pdf->Multicell(190,6,'By signing, customer agrees to and understands the terms and conditions of this contract.', 0, J, false);
$pdf->Cell(190,7,'',0,1);
$pdf->Cell(150,7,'x',0,0);
$pdf->Cell(20,7,'Date',0,1);
$pdf->Line(173,273,200,273);
$pdf->Line(10,273,158,273);



$pdf->Output();
?>
<?php
$servername = "redacted";
$username = "redacted";
$password ="redacted";
$dbname = "redacted";

$conn = new mysqli($servername, $username, $password, $dbname);

if($conn->connect_error){
  die("connection failed: ".$conn->connect_error);
}

$sql ="INSERT INTO client_info (Address, Aeration, AerationFall, AerationSpring,
                                DeepRootFertilization, DeThatching, DeThatchingFall,
                                DeThatchingSpring, DormantOil, DormantOilFall,
                                DormantOilSpring, DRFertFall, DRFertSpring, Email, Fert4Apps,
                                Fert6Apps, Fertilization, FirstName, Grub, Hollytone,
                                InsectControl, LastName, LawnMaintenance, Mosquito3Apps,
                                Mosquito5Apps, MosquitoSpray, Pest3Apps, Pest5Apps, PestSpray,
                                Phone, SprinklerShutDown, SprinklerStartUp, Weeding)
       VALUES ('".$address."', '".$aeration."', '".$coreFall."', '".$coreSpring."'
               , '".$deepFertilization."', '".$detaching."', '".$detFall."'
               , '".$detSpring."', '".$dormantOil."', '".$dormantOilFall."'
               , '".$dormantOilSpring."', '".$deepRootFertFall."', '".$deepRootFertSpring."', '".$email."', '".$fert4."'
               , '".$fert6."', '".$fertilization."', '".$firstName."', '".$grub."', '".$hollyTone."'
               , '".$insectControl."', '".$lastName."', '".$lawn."', '".$mosq3."'
               , '".$mosq5."', '".$mosquito."', '".$pest3."', '".$pest5."', '".$pest."'
               , '".$phone."', '".$sprinklerShutDown."', '".$sprinklerStartUp."', '".$weeding."')";

               if ($conn->query($sql) === FALSE) {
                   echo "Error: " . $sql . "<br>" . $conn->error;
               };

$conn->close();
?>
