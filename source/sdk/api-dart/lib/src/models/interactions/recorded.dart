import 'package:json_annotation/json_annotation.dart';

part 'recorded.g.dart';

/// Recorded
@JsonSerializable(includeIfNull: false)
class InteractionsRecorded {
  const InteractionsRecorded({required this.recorded});
  final bool recorded;

  factory InteractionsRecorded.fromJson(Map<String, dynamic> json) => _$InteractionsRecordedFromJson(json);

  Map<String, dynamic> toJson() => _$InteractionsRecordedToJson(this);
}
