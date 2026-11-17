import 'package:json_annotation/json_annotation.dart';
import 'identified.dart';

part 'created.g.dart';

/// Base for operational records: identity and creation time.
@JsonSerializable(includeIfNull: false)
class Created {
  const Created({
    required this.createdAt,
    required this.id,
  });
  final DateTime createdAt;
  final String id;

  factory Created.fromJson(Map<String, dynamic> json) => _$CreatedFromJson(json);

  Map<String, dynamic> toJson() => _$CreatedToJson(this);
}