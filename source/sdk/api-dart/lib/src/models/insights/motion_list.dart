import 'package:json_annotation/json_annotation.dart';

part 'motion_list.g.dart';

/// Motion List
@JsonSerializable(includeIfNull: false)
class InsightsMotionList {
  const InsightsMotionList({required this.motions});
  final List<Object?> motions;

  factory InsightsMotionList.fromJson(Map<String, dynamic> json) => _$InsightsMotionListFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsMotionListToJson(this);
}
