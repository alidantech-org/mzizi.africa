import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/shared/pagination_meta.dart';

part 'paginated_response.g.dart';

/// Paginated Response
@JsonSerializable(includeIfNull: false)
class SharedPaginatedResponse {
  const SharedPaginatedResponse({required this.meta});
  final SharedPaginationMeta meta;

  factory SharedPaginatedResponse.fromJson(Map<String, dynamic> json) => _$SharedPaginatedResponseFromJson(json);

  Map<String, dynamic> toJson() => _$SharedPaginatedResponseToJson(this);
}
