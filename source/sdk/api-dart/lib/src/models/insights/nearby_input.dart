import 'package:json_annotation/json_annotation.dart';

part 'nearby_input.g.dart';

/// Nearby Input
@JsonSerializable(includeIfNull: false)
class InsightsNearbyInput {
  const InsightsNearbyInput({required this.latitude, required this.longitude, this.radiusKm});
  final double latitude;
  final double longitude;
  final double? radiusKm;

  factory InsightsNearbyInput.fromJson(Map<String, dynamic> json) => _$InsightsNearbyInputFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsNearbyInputToJson(this);
}
