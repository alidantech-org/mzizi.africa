import 'package:json_annotation/json_annotation.dart';

part 'gov_tree_input.g.dart';

/// Gov Tree Input
@JsonSerializable(includeIfNull: false)
class InsightsGovTreeInput {
  const InsightsGovTreeInput({this.featureId, this.institution, this.tab});
  final String? featureId;
  final String? institution;
  final String? tab;

  factory InsightsGovTreeInput.fromJson(Map<String, dynamic> json) => _$InsightsGovTreeInputFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsGovTreeInputToJson(this);
}
