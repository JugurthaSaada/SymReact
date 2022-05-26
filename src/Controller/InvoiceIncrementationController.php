<?php

namespace App\Controller;

use App\Entity\Invoice;

class InvoiceIncrementationController{

    public function __invoke(Invoice $data)
    {
        dd($data);
    }

}

?>