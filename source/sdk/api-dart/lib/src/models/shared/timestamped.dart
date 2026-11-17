import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/shared/created.dart';

part 'timestamped.g.dart';

/// Base for operational records: identity, creation time and last-change time.
@JsonSerializable(includeIfNull: false)
class SharedTimestamped {
  const SharedTimestamped({required this.createdAt, required this.id, required this.updatedAt});
  final DateTime createdAt;
  final String id;
  final DateTime updatedAt;

  factory SharedTimestamped.fromJson(Map<String, dynamic> json) => _$SharedTimestampedFromJson(json);

  Map<String, dynamic> toJson() => _$SharedTimestampedToJson(this);
}
