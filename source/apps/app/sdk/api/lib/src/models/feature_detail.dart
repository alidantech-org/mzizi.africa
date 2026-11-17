import 'package:json_annotation/json_annotation.dart';
import 'feature_detail_names.dart';

part 'feature_detail.g.dart';

/// Feature Detail
@JsonSerializable(includeIfNull: false)
class FeatureDetail {
  const FeatureDetail({
    required this.code,
    required this.featureId,
    required this.featureTypeId,
    required this.names,
    this.validFrom,
    this.validUntil,
  });
  final String code;
  final String featureId;
  final String featureTypeId;
  final List<FeatureDetailNames> names;
  final DateTime? validFrom;
  final DateTime? validUntil;

  factory FeatureDetail.fromJson(Map<String, dynamic> json) => _$FeatureDetailFromJson(json);

  Map<String, dynamic> toJson() => _$FeatureDetailToJson(this);
}