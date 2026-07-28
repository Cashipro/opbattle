<?php

require_once __DIR__ . '/../config.php';


class TournamentEngine
{

    private $pdo;


    public function __construct($pdo)
    {
        $this->pdo = $pdo;
    }



    /*
        Tournament Structure Generate

        Input:
        - tournament id

        Ye function check karega:
        - total teams
        - teams per match
        - total rounds
    */

    public function generateStructure($tournament_id)
    {

        $stmt = $this->pdo->prepare("
            SELECT *
            FROM tournaments
            WHERE id = ?
        ");

        $stmt->execute([$tournament_id]);

        $tournament = $stmt->fetch();



        if(!$tournament)
        {
            return [
                "status" => false,
                "message" => "Tournament not found"
            ];
        }



        $totalTeams = intval($tournament['total_teams'] ?? 0);


        if($totalTeams <= 0)
        {
            return [
                "status" => false,
                "message" => "Total teams not defined"
            ];
        }



        /*
            PUBG Style Calculation

            25 Teams = 1 Match
        */

        $teamsPerMatch = 25;


        $totalMatches = ceil($totalTeams / $teamsPerMatch);



        /*
            Round Calculation

            Example:

            100 Teams

            Round 1:
            100 Teams

            Qualify:
            40 Teams

            Round 2:
            40 Teams

            Final:
            25 Teams

        */


        if($totalTeams <= 25)
        {
            $rounds = 1;
        }
        elseif($totalTeams <= 100)
        {
            $rounds = 2;
        }
        else
        {
            $rounds = 3;
        }



        return [

            "status" => true,

            "tournament_id" => $tournament_id,

            "total_teams" => $totalTeams,

            "teams_per_match" => $teamsPerMatch,

            "total_matches" => $totalMatches,

            "total_rounds" => $rounds

        ];

    }



    /*
        Qualifying Teams Calculation
    */

    public function calculateQualification($totalTeams)
    {


        if($totalTeams <= 25)
        {
            return $totalTeams;
        }


        // Top 40% qualify

        $qualified = ceil($totalTeams * 0.40);


        return $qualified;

    }



    /*
        Tournament Summary
    */

    public function summary($tournament_id)
    {

        $data = $this->generateStructure($tournament_id);


        if(!$data['status'])
        {
            return $data;
        }



        $qualified = $this->calculateQualification(
            $data['total_teams']
        );



        $data['qualified_teams'] = $qualified;



        return $data;

    }


}

?>
