import 'package:json_annotation/json_annotation.dart';

part 'tree_input.g.dart';

/// Tree Input
@JsonSerializable(includeIfNull: false)
class InsightsTreeInput {
  const InsightsTreeInput({this.featureId});
  final String? featureId;

  factory InsightsTreeInput.fromJson(Map<String, dynamic> json) => _$InsightsTreeInputFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsTreeInputToJson(this);
}
