import 'package:json_annotation/json_annotation.dart';

part 'place_input.g.dart';

/// Place Input
@JsonSerializable(includeIfNull: false)
class ExplorerPlaceInput {
  const ExplorerPlaceInput({required this.countryCode, this.featureId, this.languageCode, this.path});
  final String countryCode;
  final String? featureId;
  final String? languageCode;
  final String? path;

  factory ExplorerPlaceInput.fromJson(Map<String, dynamic> json) => _$ExplorerPlaceInputFromJson(json);

  Map<String, dynamic> toJson() => _$ExplorerPlaceInputToJson(this);
}
