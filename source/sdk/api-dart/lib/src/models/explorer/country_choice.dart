import 'package:json_annotation/json_annotation.dart';

part 'country_choice.g.dart';

/// Country Choice
@JsonSerializable(includeIfNull: false)
class ExplorerCountryChoice {
  const ExplorerCountryChoice({
    required this.code,
    this.flagUrl,
    required this.id,
    required this.name,
    this.rootFeatureId,
    required this.served,
  });
  final String code;
  final String? flagUrl;
  final String id;
  final String name;
  final String? rootFeatureId;
  final bool served;

  factory ExplorerCountryChoice.fromJson(Map<String, dynamic> json) => _$ExplorerCountryChoiceFromJson(json);

  Map<String, dynamic> toJson() => _$ExplorerCountryChoiceToJson(this);
}
