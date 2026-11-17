import 'package:json_annotation/json_annotation.dart';
import 'created.dart';

part 'timestamped.g.dart';

/// Base for operational records: identity, creation time and last-change time.
@JsonSerializable(includeIfNull: false)
class Timestamped {
  const Timestamped({
    required this.createdAt,
    required this.id,
    required this.updatedAt,
  });
  final DateTime createdAt;
  final String id;
  final DateTime updatedAt;

  factory Timestamped.fromJson(Map<String, dynamic> json) => _$TimestampedFromJson(json);

  Map<String, dynamic> toJson() => _$TimestampedToJson(this);
}