import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/explorer/flag_color.dart';

part 'country_choice.g.dart';

/// Country Choice
@JsonSerializable(includeIfNull: false)
class ExplorerCountryChoice {
  const ExplorerCountryChoice({
    required this.code,
    required this.flagColors,
    this.flagUrl,
    required this.id,
    required this.name,
    this.rootFeatureId,
    required this.served,
  });
  final String code;
  final List<ExplorerFlagColor> flagColors;
  final String? flagUrl;
  final String id;
  final String name;
  final String? rootFeatureId;
  final bool served;

  factory ExplorerCountryChoice.fromJson(Map<String, dynamic> json) => _$ExplorerCountryChoiceFromJson(json);

  Map<String, dynamic> toJson() => _$ExplorerCountryChoiceToJson(this);
}
