import 'package:json_annotation/json_annotation.dart';

part 'identified.g.dart';

/// Base for operational records: identity only.
@JsonSerializable(includeIfNull: false)
class Identified {
  const Identified({
    required this.id,
  });
  final String id;

  factory Identified.fromJson(Map<String, dynamic> json) => _$IdentifiedFromJson(json);

  Map<String, dynamic> toJson() => _$IdentifiedToJson(this);
}