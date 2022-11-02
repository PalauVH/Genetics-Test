<style>
    .infoTable {
        text-align: right;
    }

    .infoTable th {
        padding: 3px 20px;
    }

    #logTableContainer {
        border: thin solid #26408B;
        max-height: 600px;
        overflow-y: auto;
    }
    #logTable {
        position: relative;
        width: 100%;
        text-align: right;
        border-collapse: collapse;
    }
    #logTable td, #logTable th {
        padding: 5px 20px;
    }
    #logTable td {
        text-align: center;
    }
    #logTable th {
        position: sticky;
        top: 0;
        background-color: #26408B;
        color: white;
        border: thin solid #26408B;
    }
    #logTable tr:nth-child(odd) {
        background-color: hsl(0, 0%, 90%);
    }
    #logTable tr:nth-child(even) {
        background-color: hsl(0, 0%, 95%);
    }
</style>


<body style='font-family: Arial;'>
    <div style='display: flex;justify-content: center;'>
        <div style='margin: 120px 50px 0px 0px;'>
            <table class='infoTable'>
                <tr>
                    <th>Gemiddelde aantal stappen:</th>
                    <td id='meanSteps'></td>
                </tr>
                <tr>
                    <th>Maximaal aantal stappen mogelijk:</th>
                    <td id='maxSteps'></td>
                </tr>
                <tr>
                    <th>Score:</th>
                    <td id='score'></td>
                </tr>
                <tr>
                    <th>Extravert : Introvert verhouding:</th>
                    <td id='EIratio'></td>
                </tr>
                <tr>
                    <th>Extravert score:</th>
                    <td id='extravertScore' style='color: #34D1BF;'></td>
                </tr>
                <tr>
                    <th>Introvert score:</th>
                    <td id='introvertScore' style='color: #3454D1;'></td>
                </tr>
                <tr>
                    <th>Gemiddelde view distance:</th>
                    <td id='meanViewDistance' style='color: #D1345B;'></td>
                </tr>
            </table>

            <br>
            <div id='logTableContainer'>
                <table id='logTable'>
                    <tr>
                        <th colspan=7>
                            Geschiedenis
                        </th>
                    </tr>
                </table>
            </div>
        </div>
        <div>
            <button onclick='runSimulations()' id='actionButton' style='margin: 20px auto;display: block;padding: 20px;letter-spacing: 2px;font-style: bold;'>Simuleer generatie</button>
            <button onclick='stopSimulation()' id='stopButton' style='margin: 20px auto;display: block;padding: 20px;letter-spacing: 2px;font-style: bold;'>Stop simulatie</button>
        
            <canvas id="Canvas" width="500px" height="500px" style="border: thin dashed grey;margin: 0px auto;display: block;"></canvas>
            <script src="engine.js?random=<?php echo random_int(1, 10000);?>"></script>
        </div>
    </div>
</body>
    
