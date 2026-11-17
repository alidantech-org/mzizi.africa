import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/shared/identified.dart';

part 'created.g.dart';

/// Base for operational records: identity and creation time.
@JsonSerializable(includeIfNull: false)
class SharedCreated {
  const SharedCreated({required this.createdAt, required this.id});
  final DateTime createdAt;
  final String id;

  factory SharedCreated.fromJson(Map<String, dynamic> json) => _$SharedCreatedFromJson(json);

  Map<String, dynamic> toJson() => _$SharedCreatedToJson(this);
}
