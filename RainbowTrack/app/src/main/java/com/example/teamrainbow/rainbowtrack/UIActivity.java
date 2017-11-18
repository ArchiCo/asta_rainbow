package com.example.teamrainbow.rainbowtrack;

import android.content.Intent;
import android.os.Bundle;
import android.support.design.widget.FloatingActionButton;
import android.support.design.widget.Snackbar;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;

public class UIActivity extends AppCompatActivity {

    Double lapAvgD = 0.0;
    Double lapTopD = 0.0;
    Double lapTimeD = 0.0;

    Double sectorAvgD = 0.0;
    Double sectorTopD = 0.0;
    Double sectorTimeD = 0.0;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.content_ui);


    }

}
