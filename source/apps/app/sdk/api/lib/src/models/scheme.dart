import 'package:json_annotation/json_annotation.dart';
import 'coded_entity.dart';

part 'scheme.g.dart';

/// Stable identity and stewardship snapshot for a controlled vocabulary scheme.
@JsonSerializable(includeIfNull: false)
class Scheme {
  const Scheme({
    required this.code,
    required this.createdAt,
    this.deletedAt,
    required this.id,
    required this.ownerSnapshot,
    required this.title,
    required this.updatedAt,
    required this.version,
  });
  final String code;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String id;
  final String ownerSnapshot;
  final String title;
  final DateTime updatedAt;
  final int version;

  factory Scheme.fromJson(Map<String, dynamic> json) => _$SchemeFromJson(json);

  Map<String, dynamic> toJson() => _$SchemeToJson(this);
}