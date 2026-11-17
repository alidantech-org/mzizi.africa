import 'package:json_annotation/json_annotation.dart';

part 'identified.g.dart';

/// Base for operational records: identity only.
@JsonSerializable(includeIfNull: false)
class SharedIdentified {
  const SharedIdentified({required this.id});
  final String id;

  factory SharedIdentified.fromJson(Map<String, dynamic> json) => _$SharedIdentifiedFromJson(json);

  Map<String, dynamic> toJson() => _$SharedIdentifiedToJson(this);
}
