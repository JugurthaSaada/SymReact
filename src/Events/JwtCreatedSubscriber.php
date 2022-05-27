<?php

namespace App\Events;

use Lexik\Bundle\JWTAuthenticationBundle\Event\JWTCreatedEvent;

class JwtCreatedSubscriber{

    public function updateJwtData(JWTCreatedEvent $event){
        //recup l'utilisateur - firstname et lastname
        $user = $event->getUser();
        $data = $event->getData();
        $data['firstName'] = $user->getFirstName();
        $data['lastName'] = $user->getLastName();

        $event->setData($data);
    }

}