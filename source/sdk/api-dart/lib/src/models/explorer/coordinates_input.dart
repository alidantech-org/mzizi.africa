import 'package:json_annotation/json_annotation.dart';

part 'coordinates_input.g.dart';

/// Coordinates Input
@JsonSerializable(includeIfNull: false)
class ExplorerCoordinatesInput {
  const ExplorerCoordinatesInput({this.accuracyMeters, this.countryCode, this.languageCode, required this.latitude, required this.longitude});
  final double? accuracyMeters;
  final String? countryCode;
  final String? languageCode;
  final double latitude;
  final double longitude;

  factory ExplorerCoordinatesInput.fromJson(Map<String, dynamic> json) => _$ExplorerCoordinatesInputFromJson(json);

  Map<String, dynamic> toJson() => _$ExplorerCoordinatesInputToJson(this);
}
