import 'package:json_annotation/json_annotation.dart';

part 'content_list_items_classification.g.dart';

/// Content List Items Classification
@JsonSerializable(includeIfNull: false)
class InsightsContentListItemsClassification {
  const InsightsContentListItemsClassification({required this.code, required this.label});
  final String code;
  final String label;

  factory InsightsContentListItemsClassification.fromJson(Map<String, dynamic> json) => _$InsightsContentListItemsClassificationFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsContentListItemsClassificationToJson(this);
}
