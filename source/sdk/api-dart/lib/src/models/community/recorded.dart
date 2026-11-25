import 'package:json_annotation/json_annotation.dart';

part 'recorded.g.dart';

/// Recorded
@JsonSerializable(includeIfNull: false)
class CommunityRecorded {
  const CommunityRecorded({required this.recorded});
  final bool recorded;

  factory CommunityRecorded.fromJson(Map<String, dynamic> json) => _$CommunityRecordedFromJson(json);

  Map<String, dynamic> toJson() => _$CommunityRecordedToJson(this);
}
