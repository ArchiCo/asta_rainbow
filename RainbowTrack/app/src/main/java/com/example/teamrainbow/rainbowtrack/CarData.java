package com.example.teamrainbow.rainbowtrack;

import android.util.Log;

import java.text.DecimalFormat;

/**
 * Created by Insane on 18/11/2017.
 */

public class CarData {
    /*

    CarData(int id,
            int objectType,
            int timeStampPlts,
            int latitude,
            int longitude,
            int altitude,
            int speed,
            int heading,
            int direction
            ) {
        this.id = id;
        this.objectType = objectType;
        this.timeStampPlts = timeStampPlts;
        this.latitude = ;
        this.longitude;
        this.altitude;
        this.speed;
        this.heading;
        this.direction
*/
    int[] carData = new int[9];
    int
            id,             // Integer
            objectType,     // Integer
            speed,          // 0.01 m/s 0 - 16382
            heading,        // 0.10 degrees relative to north 0 - 3600
            direction;      // 0 forward, backwards -1 Enum
    long    timeStampPlts;  // milliseconds since 2007
    double  latitude,       // 0.1 microdegrees. 0 - 900 000 000. 57.777198 577795978
            longitude,      // 0.10 microdegrees. 0 - 900 000 000
            altitude;       // 0.01 meters; 0 - 800 000 000

    CarData(String str) {
        try {
            String[] dataStr = str.split(";");
            if (dataStr.length == 9) {
                /*for (int i = 0; i < dataStr.length; i++) {
                    if (dataStr[i].isEmpty() || dataStr[i].equals("")) {
                        throw new Exception("'tis empty!");
                    }
                    carData[i] = Integer.parseInt(dataStr[i]);
                }*/
                DecimalFormat df = new DecimalFormat("#.0000000");
                id = Integer.parseInt(dataStr[0]);
                objectType = Integer.parseInt(dataStr[1]);
                timeStampPlts = Long.parseLong(dataStr[2]);
                latitude = Double.parseDouble(df.format(Double.parseDouble(dataStr[3]) * 0.0000001));
                longitude = Double.parseDouble(df.format(Double.parseDouble(dataStr[4]) * 0.0000001));
                altitude = Double.parseDouble(dataStr[5]);
                speed = Integer.parseInt(dataStr[6]);
                heading = Integer.parseInt(dataStr[7]);
                direction = Integer.parseInt(dataStr[8]);

            } else {

                throw new Exception("Incorrect data size.");
            }
        } catch (Exception ex) {
            Log.e("CarData: ", "What's this?");
        }
    }

    public double getLat() {
        return latitude;
    }

    public double getLong() {
        return longitude;
    }

    public double getAlt() {
        return altitude;
    }

    public int getSpeed() {
        return speed;
    }

    public long getTimeStamp() {
        return timeStampPlts;
    }

    public String debugString(){
        String s = "id: " + id+ ", " +
                "ObjectType: " + objectType + ", " +
                "TimeStampPlts: " + timeStampPlts + ", " +
                "Latitude: " + latitude + ", " +
                "Longitude: " + longitude + ", " +
                "Altitude: " + altitude + ", " +
                "Speed: " + speed + ", " +
                "Heading: " + heading + ", " +
                "Direction: " + direction + ";";
        return s;
    }
}
