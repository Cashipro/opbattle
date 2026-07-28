<?php

require_once __DIR__ . '/../config.php';


// ==========================================
// PUBG POINT SYSTEM
// ==========================================

function getPlacementPoints($position)
{
    $points = [

        1 => 15,
        2 => 12,
        3 => 10,
        4 => 8,
        5 => 6,
        6 => 5,
        7 => 4,
        8 => 3,
        9 => 2,
        10 => 1

    ];

    return $points[$position] ?? 0;
}



// ==========================================
// KILL POINT CALCULATION
// ==========================================

function getKillPoints($kills)
{
    // PUBG style:
    // 1 Kill = 1 Point

    return intval($kills);
}




// ==========================================
// TOTAL MATCH POINT
// ==========================================

function calculateTotalPoints($position, $kills)
{

    $placement = getPlacementPoints($position);

    $kill = getKillPoints($kills);


    return $placement + $kill;

}




// ==========================================
// TOTAL MATCHES CALCULATION
// ==========================================

function calculateMatches($teams)
{

    /*
    
    PUBG tournament structure:

    25 Teams

    Round 1:
    25 teams

    Each match:
    25 teams


    Formula:
    Every 25 teams = 1 match


    */

    return ceil($teams / 25);

}




// ==========================================
// QUALIFY TEAM COUNT
// ==========================================

function calculateQualifiedTeams($totalTeams)
{


    /*
    
    Top 50% teams qualify

    Example:

    25 Teams

    12 qualify


    */

    return ceil($totalTeams / 2);

}




// ==========================================
// SORT RANKING
// ==========================================

function sortRankings($teams)
{

    usort($teams, function($a,$b){

        if($a['total_points'] == $b['total_points'])
        {
            return $b['total_kills'] - $a['total_kills'];
        }


        return $b['total_points'] - $a['total_points'];

    });


    return $teams;

}




// ==========================================
// CREATE ROUND NAME
// ==========================================

function getRoundName($round)
{

    $rounds = [

        1 => "Round 1",
        2 => "Quarter Final",
        3 => "Semi Final",
        4 => "Grand Final"

    ];


    return $rounds[$round] ?? "Round ".$round;

}




// ==========================================
// TOURNAMENT STATUS
// ==========================================

function tournamentStatus($status)
{

    $data = [

        'draft'=>"Draft",

        'registration'=>"Registration Open",

        'locked'=>"Teams Locked",

        'running'=>"Tournament Live",

        'completed'=>"Completed"

    ];


    return $data[$status] ?? "Unknown";

}





// ==========================================
// CHECK TEAM FULL
// ==========================================

function isTeamFull($team)
{

    if(
        !empty($team['player_1']) &&
        !empty($team['player_2']) &&
        !empty($team['player_3']) &&
        !empty($team['player_4'])
    )
    {

        return true;

    }


    return false;

}




// ==========================================
// GENERATE TEAM NAME
// ==========================================

function generateTeamName($number)
{

    return "Team #".$number;

}




// ==========================================
// SAFE OUTPUT
// ==========================================

function clean($value)
{

    return htmlspecialchars(
        $value,
        ENT_QUOTES,
        'UTF-8'
    );

}


?>