package com.example.teamrainbow.rainbowtrack;

import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;

public class UIActivity_UI extends AppCompatActivity {

    Double lapAvgD = 0.0;
    Double lapTopD = 0.0;
    Double lapTimeD = 0.0;

    Double sectorAvgD = 0.0;
    Double sectorTopD = 0.0;
    Double sectorTimeD = 0.0;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_ui_ui);

        final TextView lapAvg = (TextView) findViewById(R.id.number_lapAvg);
        TextView lapTop = (TextView) findViewById(R.id.number_lapTop);
        TextView lapTime = (TextView) findViewById(R.id.number_lapTime);


        final TextView sectorAvg = (TextView) findViewById(R.id.number_sectorAvg);
        TextView sectorTop = (TextView) findViewById(R.id.number_sectorTop);
        TextView sectorTime = (TextView) findViewById(R.id.number_sectorTime);

        Button test1 = (Button) findViewById(R.id.button_avg);
        test1.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {

            }
        });

        Button test2 = (Button) findViewById(R.id.button_avg);
        test1.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
            }
        });



    }
}
