import { Snowflake, Flame, Droplets, Thermometer } from "lucide-react";

export function envIcon(type) {
    const map = {
        snowflake: <Snowflake className="h-5 w-5" />,
        hot: <Flame className="h-5 w-5" />,
        humidity: <Droplets className="h-5 w-5" />,
        temp: <Thermometer className="h-5 w-5" />,
    };

    return map[type] || <Thermometer className="h-5 w-5" />;
}