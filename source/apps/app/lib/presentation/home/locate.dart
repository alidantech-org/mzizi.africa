import 'package:geolocator/geolocator.dart';
import 'package:mzizi_api/api.dart';
import 'package:mzizi_app/presentation/home/place_picker.dart';

/// Reads the phone's position (only when asked) and returns the place there, or null when it was not allowed, not
/// available or not inside the data.
Future<PickedPlace?> locateMe() async {
  try {
    var permission = await Geolocator.checkPermission();
    if (permission == LocationPermission.denied) {
      permission = await Geolocator.requestPermission();
    }
    if (permission == LocationPermission.denied ||
        permission == LocationPermission.deniedForever) {
      return null;
    }
    final p = await Geolocator.getCurrentPosition(
      locationSettings: const LocationSettings(
        accuracy: LocationAccuracy.low,
        timeLimit: Duration(seconds: 12),
      ),
    );
    final r = await LocalityFeature(MziziApi.connection).resolveLocality(
      input: LocalityPositionInput(
        latitude: p.latitude,
        longitude: p.longitude,
      ),
    );
    final place = r.dataOrNull?.place;
    if (place == null) return null;
    return (id: place.featureId, name: place.name, kind: place.kindCode);
  } catch (_) {
    return null;
  }
}
